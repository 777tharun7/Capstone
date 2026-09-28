"""
Comprehensive Model Evaluation Framework for RL Recommendation System.
Runs benchmark evaluation comparing Collaborative Filtering, Contextual Bandit, DQN, and PPO
on sequential engagement metrics:
- CTR
- Average Reward
- Cumulative Reward
- Average Session Duration
- Engagement Rate
- Retention Rate
- Recommendation Diversity (Intra-list genre diversity)
- Skip Rate
- Average interactions per session
"""

import os
import json
import numpy as np
from typing import Dict, Any, List

from backend.environment.recommendation_env import RecommendationEnvironment
from backend.models.collaborative_filtering import CollaborativeFilteringModel
from backend.models.contextual_bandit import ContextualBanditModel
from backend.models.dqn import DQNModel
from backend.models.ppo import PPOModel

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models")
EXPERIMENTS_DIR = os.path.join(BASE_DIR, "experiments")

def evaluate_model_on_env(
    model_name: str,
    model: Any,
    env: RecommendationEnvironment,
    num_test_sessions: int = 50,
    seed: int = 100
) -> Dict[str, Any]:
    """
    Evaluate a recommendation model across N simulated user test sessions.
    """
    session_rewards = []
    session_lengths = []
    total_clicks = 0
    total_likes = 0
    total_skips = 0
    total_shares = 0
    total_meaningful = 0
    total_interactions = 0
    retained_sessions = 0
    recommended_items_all = []
    session_genre_diversities = []

    np.random.seed(seed)
    test_user_ids = list(env.users.keys())[:num_test_sessions]

    for uid in test_user_ids:
        state, info = env.reset(options={"user_id": uid})
        done = False
        session_reward = 0.0
        session_steps = 0
        user_history = []
        genres_in_session = []

        while not done:
            # Model inference
            if model_name == "Collaborative Filtering":
                action = model.select_action(uid, user_history)
            elif model_name == "Contextual Bandit":
                action = model.select_action(state)
            elif model_name == "DQN":
                action, _ = model.select_action(state, evaluate=True)
                # Damping if repeated in last 2 steps
                if action in user_history[-2:]:
                    recs = model.recommend(state, top_k=5)
                    for r in recs:
                        if r not in user_history[-3:]:
                            action = r
                            break
            elif model_name == "PPO":
                action, _ = model.select_action(state, evaluate=True, recent_actions=user_history)
            elif model_name == "Random Baseline":
                action = int(np.random.randint(0, env.num_items))
            else:
                action = int(np.random.randint(0, env.num_items))

            next_state, reward, terminated, truncated, step_info = env.step(action)
            done = terminated or truncated

            user_history.append(action)
            recommended_items_all.append(action)
            item_data = env.items[action]
            genres_in_session.append(item_data["primary_genre"])

            interaction = step_info["interaction"]
            total_interactions += 1
            if interaction == "click":
                total_clicks += 1
            elif interaction == "like":
                total_likes += 1
            elif interaction == "share":
                total_shares += 1
            elif interaction == "meaningful_interaction":
                total_meaningful += 1
            elif interaction == "skip":
                total_skips += 1

            session_reward += reward
            session_steps += 1
            state = next_state

        session_rewards.append(session_reward)
        session_lengths.append(session_steps)
        if session_steps >= 10:
            retained_sessions += 1

        # Session genre diversity (Shannon entropy / unique proportion)
        unique_g = len(set(genres_in_session))
        genre_diversity = unique_g / max(1, session_steps)
        session_genre_diversities.append(genre_diversity)

    total_acts = max(1, total_interactions)
    ctr = total_clicks / total_acts
    engagement_rate = (total_likes + total_shares + total_meaningful + total_clicks) / total_acts
    skip_rate = total_skips / total_acts
    retention_rate = retained_sessions / max(1, len(test_user_ids))
    unique_items_recommended = len(set(recommended_items_all))
    catalog_coverage = unique_items_recommended / max(1, env.num_items)
    avg_diversity = float(np.mean(session_genre_diversities))

    metrics = {
        "model_name": model_name,
        "num_test_sessions": len(test_user_ids),
        "avg_cumulative_reward": round(float(np.mean(session_rewards)), 3),
        "std_cumulative_reward": round(float(np.std(session_rewards)), 3),
        "avg_reward_per_step": round(float(np.mean(session_rewards) / max(1, np.mean(session_lengths))), 3),
        "ctr": round(float(ctr), 4),
        "engagement_rate": round(float(engagement_rate), 4),
        "skip_rate": round(float(skip_rate), 4),
        "retention_rate": round(float(retention_rate), 4),
        "avg_session_duration": round(float(np.mean(session_lengths)), 2),
        "catalog_coverage": round(float(catalog_coverage), 4),
        "recommendation_diversity": round(float(avg_diversity), 4),
        "avg_interactions_per_session": round(float(np.mean(session_lengths)), 2),
        "session_rewards": [round(float(r), 2) for r in session_rewards[:20]]
    }
    return metrics

def run_full_benchmark(num_test_sessions: int = 50) -> Dict[str, Any]:
    """
    Run full benchmark across all 4 models and Random baseline.
    """
    os.makedirs(EXPERIMENTS_DIR, exist_ok=True)
    env = RecommendationEnvironment()

    print("[Evaluation] Initializing and loading all models for comparative benchmark...")

    # 1. Collaborative Filtering
    cf_model = CollaborativeFilteringModel(num_users=env.num_users, num_items=env.num_items)
    cf_path = os.path.join(SAVED_MODELS_DIR, "cf_model", "cf_model.pkl")
    if os.path.exists(cf_path):
        cf_model.load(cf_path)
    else:
        from backend.training.train_baseline import train_cf
        cf_model = train_cf()

    # 2. Contextual Bandit
    bandit_model = ContextualBanditModel(num_items=env.num_items, context_dim=env.state_dim)
    bandit_path = os.path.join(SAVED_MODELS_DIR, "bandit_model", "bandit_model.pkl")
    if os.path.exists(bandit_path):
        bandit_model.load(bandit_path)
    else:
        from backend.training.train_bandit import train_bandit
        bandit_model, _ = train_bandit()

    # 3. DQN
    dqn_model = DQNModel(state_dim=env.state_dim, action_dim=env.num_items)
    dqn_path = os.path.join(SAVED_MODELS_DIR, "dqn_model", "dqn_model.pt")
    if os.path.exists(dqn_path):
        dqn_model.load(dqn_path)
    else:
        from backend.training.train_dqn import train_dqn
        dqn_model, _ = train_dqn()

    # 4. PPO
    ppo_model = PPOModel(state_dim=env.state_dim, action_dim=env.num_items)
    ppo_path = os.path.join(SAVED_MODELS_DIR, "ppo_model", "ppo_model.pt")
    if os.path.exists(ppo_path):
        ppo_model.load(ppo_path)
    else:
        from backend.training.train_ppo import train_ppo
        ppo_model, _ = train_ppo()

    models = [
        ("Collaborative Filtering", cf_model),
        ("Contextual Bandit", bandit_model),
        ("DQN", dqn_model),
        ("PPO", ppo_model)
    ]

    results = {}
    for name, model in models:
        print(f"[Evaluation] Evaluating {name}...")
        metrics = evaluate_model_on_env(name, model, env, num_test_sessions=num_test_sessions)
        results[name] = metrics
        print(f"  -> Avg Reward: {metrics['avg_cumulative_reward']} | Session Len: {metrics['avg_session_duration']} | Retention: {metrics['retention_rate']:.1%}")

    output_path = os.path.join(EXPERIMENTS_DIR, "evaluation_results.json")
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)

    print(f"[Evaluation] Complete benchmark evaluation saved to {output_path}")
    return results

if __name__ == "__main__":
    run_full_benchmark()
