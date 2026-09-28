"""
Training Pipeline for Contextual Bandit (LinUCB) Baseline.
Iterates through simulated recommendation sessions updating ridge regression parameters.
"""

import os
import json
import numpy as np
from backend.models.contextual_bandit import ContextualBanditModel
from backend.environment.recommendation_env import RecommendationEnvironment

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models", "bandit_model")
EXPERIMENTS_DIR = os.path.join(BASE_DIR, "experiments")

def train_bandit(episodes: int = 150):
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    os.makedirs(EXPERIMENTS_DIR, exist_ok=True)
    
    env = RecommendationEnvironment()
    model = ContextualBanditModel(num_items=env.num_items, context_dim=env.state_dim, alpha=0.8)

    print(f"[Train Bandit] Training LinUCB Contextual Bandit for {episodes} episodes...")
    history = []

    for ep in range(episodes):
        state, _ = env.reset()
        episode_reward = 0.0
        steps = 0
        done = False

        while not done:
            action = model.select_action(state)
            next_state, reward, terminated, truncated, _ = env.step(action)
            done = terminated or truncated
            
            # Bandit update on immediate reward
            model.update(action, state, reward)
            
            state = next_state
            episode_reward += reward
            steps += 1

        history.append({
            "episode": ep + 1,
            "reward": round(float(episode_reward), 4),
            "steps": steps
        })

        if (ep + 1) % 25 == 0:
            avg_rew = np.mean([h["reward"] for h in history[-25:]])
            print(f"[Train Bandit] Episode {ep+1}/{episodes} | Avg Reward (last 25): {avg_rew:.2f}")

    save_path = os.path.join(SAVED_MODELS_DIR, "bandit_model.pkl")
    model.save(save_path)
    
    with open(os.path.join(EXPERIMENTS_DIR, "bandit_training_history.json"), "w") as f:
        json.dump(history, f, indent=2)

    print(f"[Train Bandit] Model saved successfully to {save_path}")
    return model, history

if __name__ == "__main__":
    train_bandit()
