"""
Training Pipeline for Deep Q-Network (DQN).
Trains DQN agent in the Gymnasium Recommendation Environment, tracks TD loss & rewards,
and saves model checkpoints and training curves.
"""

import os
import json
import numpy as np
import torch
from backend.models.dqn import DQNModel
from backend.environment.recommendation_env import RecommendationEnvironment

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models", "dqn_model")
EXPERIMENTS_DIR = os.path.join(BASE_DIR, "experiments")

def train_dqn(
    episodes: int = 200,
    lr: float = 1e-3,
    gamma: float = 0.95,
    batch_size: int = 64,
    target_update_freq: int = 10,
    epsilon_decay: float = 0.992
):
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    os.makedirs(EXPERIMENTS_DIR, exist_ok=True)

    env = RecommendationEnvironment()
    agent = DQNModel(
        state_dim=env.state_dim,
        action_dim=env.num_items,
        lr=lr,
        gamma=gamma,
        epsilon_start=1.0,
        epsilon_end=0.05,
        epsilon_decay=epsilon_decay,
        batch_size=batch_size,
        target_update_freq=target_update_freq
    )

    print(f"[Train DQN] Training DQN on device '{agent.device}' for {episodes} episodes...")
    history = []
    best_reward = -float("inf")

    for ep in range(episodes):
        state, _ = env.reset()
        episode_reward = 0.0
        episode_loss = []
        steps = 0
        done = False

        while not done:
            action, _ = agent.select_action(state, evaluate=False)
            next_state, reward, terminated, truncated, _ = env.step(action)
            done = terminated or truncated

            agent.store_transition(state, action, reward, next_state, done)
            loss = agent.train_step()
            if loss is not None:
                episode_loss.append(loss)

            state = next_state
            episode_reward += reward
            steps += 1

        avg_loss = float(np.mean(episode_loss)) if len(episode_loss) > 0 else 0.0
        history.append({
            "episode": ep + 1,
            "reward": round(float(episode_reward), 4),
            "loss": round(avg_loss, 4),
            "epsilon": round(float(agent.epsilon), 4),
            "steps": steps
        })

        if episode_reward > best_reward:
            best_reward = episode_reward
            agent.save(os.path.join(SAVED_MODELS_DIR, "best_dqn_model.pt"))

        if (ep + 1) % 25 == 0:
            avg_rew = np.mean([h["reward"] for h in history[-25:]])
            print(f"[Train DQN] Episode {ep+1}/{episodes} | Avg Reward: {avg_rew:.2f} | Eps: {agent.epsilon:.3f} | Loss: {avg_loss:.4f}")

    # Save final model
    agent.save(os.path.join(SAVED_MODELS_DIR, "dqn_model.pt"))
    with open(os.path.join(EXPERIMENTS_DIR, "dqn_training_history.json"), "w") as f:
        json.dump(history, f, indent=2)

    print(f"[Train DQN] Training complete. Saved model to {SAVED_MODELS_DIR}/dqn_model.pt")
    return agent, history

if __name__ == "__main__":
    train_dqn()
