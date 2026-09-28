"""
Training Pipeline for Proximal Policy Optimization (PPO).
Trains Actor-Critic policy using Generalized Advantage Estimation (GAE)
and clipped surrogate objective.
"""

import os
import json
import numpy as np
import torch
from backend.models.ppo import PPOModel
from backend.environment.recommendation_env import RecommendationEnvironment

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models", "ppo_model")
EXPERIMENTS_DIR = os.path.join(BASE_DIR, "experiments")

def train_ppo(
    episodes: int = 200,
    lr_actor: float = 3e-4,
    lr_critic: float = 1e-3,
    gamma: float = 0.98,
    gae_lambda: float = 0.95,
    clip_eps: float = 0.2,
    entropy_coef: float = 0.01,
    rollout_batch_steps: int = 64
):
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    os.makedirs(EXPERIMENTS_DIR, exist_ok=True)

    env = RecommendationEnvironment()
    agent = PPOModel(
        state_dim=env.state_dim,
        action_dim=env.num_items,
        lr_actor=lr_actor,
        lr_critic=lr_critic,
        gamma=gamma,
        gae_lambda=gae_lambda,
        clip_eps=clip_eps,
        entropy_coef=entropy_coef
    )

    print(f"[Train PPO] Training PPO on device '{agent.device}' for {episodes} episodes...")
    history = []
    best_reward = -float("inf")
    accumulated_steps = 0
    last_metrics = {}

    for ep in range(episodes):
        state, _ = env.reset()
        episode_reward = 0.0
        steps = 0
        done = False

        while not done:
            action, info = agent.select_action(state, evaluate=False)
            next_state, reward, terminated, truncated, _ = env.step(action)
            done = terminated or truncated

            agent.store_transition(
                state=state,
                action=action,
                reward=reward,
                log_prob=info["log_prob"],
                value=info["estimated_value"],
                done=done
            )
            
            accumulated_steps += 1
            if len(agent.buffer) >= rollout_batch_steps or (done and len(agent.buffer) >= 16):
                update_info = agent.train_step(next_state, done)
                if update_info:
                    last_metrics = update_info

            state = next_state
            episode_reward += reward
            steps += 1

        history.append({
            "episode": ep + 1,
            "reward": round(float(episode_reward), 4),
            "policy_loss": round(float(last_metrics.get("policy_loss", 0.0)), 4),
            "value_loss": round(float(last_metrics.get("value_loss", 0.0)), 4),
            "entropy": round(float(last_metrics.get("entropy", 0.0)), 4),
            "steps": steps
        })

        if episode_reward > best_reward:
            best_reward = episode_reward
            agent.save(os.path.join(SAVED_MODELS_DIR, "best_ppo_model.pt"))

        if (ep + 1) % 25 == 0:
            avg_rew = np.mean([h["reward"] for h in history[-25:]])
            print(f"[Train PPO] Episode {ep+1}/{episodes} | Avg Reward: {avg_rew:.2f} | PolLoss: {last_metrics.get('policy_loss', 0.0):.4f} | Steps: {steps}")

    # Save final model
    agent.save(os.path.join(SAVED_MODELS_DIR, "ppo_model.pt"))
    with open(os.path.join(EXPERIMENTS_DIR, "ppo_training_history.json"), "w") as f:
        json.dump(history, f, indent=2)

    print(f"[Train PPO] Training complete. Saved model to {SAVED_MODELS_DIR}/ppo_model.pt")
    return agent, history

if __name__ == "__main__":
    train_ppo()
