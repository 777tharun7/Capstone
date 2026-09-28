"""
Proximal Policy Optimization (PPO) Model for Adaptive Recommendation System.
Primary proposed Reinforcement Learning model optimizing sequential engagement & retention.
"""

import os
from typing import List, Tuple, Dict, Any, Optional

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.distributions import Categorical

def layer_init(layer, std=np.sqrt(2), bias_const=0.0):
    torch.nn.init.orthogonal_(layer.weight, std)
    torch.nn.init.constant_(layer.bias, bias_const)
    return layer

class ActorCritic(nn.Module):
    """Combined Actor-Critic architecture for PPO."""
    def __init__(self, state_dim: int = 48, action_dim: int = 100, hidden_dim: int = 128):
        super().__init__()
        
        # Policy Network (Actor)
        self.actor = nn.Sequential(
            layer_init(nn.Linear(state_dim, hidden_dim)),
            nn.Tanh(),
            layer_init(nn.Linear(hidden_dim, hidden_dim)),
            nn.Tanh(),
            layer_init(nn.Linear(hidden_dim, action_dim), std=0.01)
        )
        
        # Value Network (Critic)
        self.critic = nn.Sequential(
            layer_init(nn.Linear(state_dim, hidden_dim)),
            nn.Tanh(),
            layer_init(nn.Linear(hidden_dim, hidden_dim)),
            nn.Tanh(),
            layer_init(nn.Linear(hidden_dim, 1), std=1.0)
        )

    def forward(self, state: torch.Tensor) -> Tuple[Categorical, torch.Tensor]:
        logits = self.actor(state)
        logits = torch.clamp(logits, min=-20.0, max=20.0)
        dist = Categorical(logits=logits)
        value = self.critic(state)
        return dist, value

class PPORolloutBuffer:
    """Storage for experience trajectories in PPO on-policy batch updates."""
    def __init__(self):
        self.states = []
        self.actions = []
        self.rewards = []
        self.log_probs = []
        self.values = []
        self.dones = []

    def clear(self):
        self.states.clear()
        self.actions.clear()
        self.rewards.clear()
        self.log_probs.clear()
        self.values.clear()
        self.dones.clear()

    def add(self, state: np.ndarray, action: int, reward: float, log_prob: float, value: float, done: bool):
        self.states.append(state)
        self.actions.append(action)
        self.rewards.append(reward)
        self.log_probs.append(log_prob)
        self.values.append(value)
        self.dones.append(done)

    def __len__(self):
        return len(self.states)

class PPOModel:
    """
    Proximal Policy Optimization (PPO) Reinforcement Learning Agent.
    """
    def __init__(
        self,
        state_dim: int = 48,
        action_dim: int = 100,
        lr_actor: float = 3e-4,
        lr_critic: float = 1e-3,
        gamma: float = 0.98,
        gae_lambda: float = 0.95,
        clip_eps: float = 0.2,
        entropy_coef: float = 0.03,
        value_coef: float = 0.5,
        ppo_epochs: int = 4,
        batch_size: int = 32,
        device: Optional[str] = None
    ):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.gamma = gamma
        self.gae_lambda = gae_lambda
        self.clip_eps = clip_eps
        self.entropy_coef = entropy_coef
        self.value_coef = value_coef
        self.ppo_epochs = ppo_epochs
        self.batch_size = batch_size
        
        self.device = torch.device(device if device else ("cuda" if torch.cuda.is_available() else "cpu"))
        
        self.network = ActorCritic(state_dim, action_dim).to(self.device)
        self.optimizer = optim.Adam(self.network.parameters(), lr=lr_actor, eps=1e-5)
        
        self.buffer = PPORolloutBuffer()
        self.is_trained = False

    def select_action(
        self,
        state: np.ndarray,
        evaluate: bool = False,
        recent_actions: Optional[List[int]] = None
    ) -> Tuple[int, Dict[str, Any]]:
        """
        Select action from policy distribution with repetition avoidance.
        """
        state_t = torch.FloatTensor(state).unsqueeze(0).to(self.device)
        with torch.no_grad():
            dist, value = self.network(state_t)
            probs = dist.probs.squeeze(0).cpu().numpy()
            
            if np.isnan(probs).any():
                probs = np.ones(self.action_dim, dtype=np.float32) / self.action_dim

            # Apply repetition damping for sequential evaluation
            adjusted_probs = probs.copy()
            if recent_actions:
                for act in recent_actions[-4:]:
                    if act < len(adjusted_probs):
                        adjusted_probs[act] *= 0.1
                s = np.sum(adjusted_probs)
                if s > 1e-6:
                    adjusted_probs /= s

            if evaluate:
                action = int(np.argmax(adjusted_probs))
            else:
                action = int(np.random.choice(self.action_dim, p=adjusted_probs))
                
            log_prob = float(dist.log_prob(torch.tensor(action).to(self.device)).item())
            val = float(value.squeeze(0).item())

        top_actions = np.argsort(adjusted_probs)[::-1][:5].tolist()
        top_probs = [float(adjusted_probs[a]) for a in top_actions]

        info = {
            "selected_action": action,
            "action_prob": float(probs[action]),
            "adjusted_prob": float(adjusted_probs[action]),
            "log_prob": log_prob,
            "estimated_value": val,
            "top_actions": top_actions,
            "top_probs": top_probs,
            "action_distribution": [round(float(p), 4) for p in probs[:15]],
            "entropy": float(dist.entropy().item())
        }
        return action, info

    def store_transition(self, state: np.ndarray, action: int, reward: float, log_prob: float, value: float, done: bool):
        self.buffer.add(state, action, reward, log_prob, value, done)

    def train_step(self, next_state: np.ndarray, done: bool) -> Dict[str, float]:
        if len(self.buffer) < 8:
            return {}

        state_t = torch.FloatTensor(next_state).unsqueeze(0).to(self.device)
        with torch.no_grad():
            _, next_val = self.network(state_t)
            next_value = float(next_val.squeeze().item()) if not done else 0.0

        rewards = self.buffer.rewards
        values = self.buffer.values + [next_value]
        dones = self.buffer.dones
        
        advantages = np.zeros(len(rewards), dtype=np.float32)
        gae = 0.0
        for t in reversed(range(len(rewards))):
            delta = rewards[t] + self.gamma * values[t + 1] * (1.0 - dones[t]) - values[t]
            gae = delta + self.gamma * self.gae_lambda * (1.0 - dones[t]) * gae
            advantages[t] = gae
            
        returns = advantages + np.array(self.buffer.values, dtype=np.float32)
        
        b_states = torch.FloatTensor(np.array(self.buffer.states)).to(self.device)
        b_actions = torch.LongTensor(self.buffer.actions).to(self.device)
        b_old_log_probs = torch.FloatTensor(self.buffer.log_probs).to(self.device)
        b_returns = torch.FloatTensor(returns).to(self.device)
        b_advantages = torch.FloatTensor(advantages).to(self.device)
        
        if b_advantages.numel() > 1:
            std = b_advantages.std(unbiased=False)
            if std > 1e-6:
                b_advantages = (b_advantages - b_advantages.mean()) / (std + 1e-8)

        total_policy_loss = 0.0
        total_value_loss = 0.0
        total_entropy = 0.0
        n_updates = 0

        indices = np.arange(len(self.buffer))
        batch_sz = min(self.batch_size, len(self.buffer))
        
        for _ in range(self.ppo_epochs):
            np.random.shuffle(indices)
            for start in range(0, len(self.buffer), batch_sz):
                end = start + batch_sz
                mb_idx = indices[start:end]
                
                mb_states = b_states[mb_idx]
                mb_actions = b_actions[mb_idx]
                mb_old_log_probs = b_old_log_probs[mb_idx]
                mb_returns = b_returns[mb_idx]
                mb_adv = b_advantages[mb_idx]

                dist, val = self.network(mb_states)
                new_log_probs = dist.log_prob(mb_actions)
                entropy = dist.entropy().mean()

                log_ratio = new_log_probs - mb_old_log_probs
                ratio = torch.exp(torch.clamp(log_ratio, -10.0, 10.0))
                
                surr1 = ratio * mb_adv
                surr2 = torch.clamp(ratio, 1.0 - self.clip_eps, 1.0 + self.clip_eps) * mb_adv
                policy_loss = -torch.min(surr1, surr2).mean()

                value_loss = nn.MSELoss()(val.squeeze(-1), mb_returns)
                loss = policy_loss + self.value_coef * value_loss - self.entropy_coef * entropy

                self.optimizer.zero_grad()
                loss.backward()
                nn.utils.clip_grad_norm_(self.network.parameters(), max_norm=0.5)
                self.optimizer.step()

                total_policy_loss += float(policy_loss.item())
                total_value_loss += float(value_loss.item())
                total_entropy += float(entropy.item())
                n_updates += 1

        self.buffer.clear()
        self.is_trained = True

        return {
            "policy_loss": total_policy_loss / max(1, n_updates),
            "value_loss": total_value_loss / max(1, n_updates),
            "entropy": total_entropy / max(1, n_updates)
        }

    def recommend(self, state: np.ndarray, top_k: int = 10, recent_actions: Optional[List[int]] = None) -> List[int]:
        state_t = torch.FloatTensor(state).unsqueeze(0).to(self.device)
        with torch.no_grad():
            dist, _ = self.network(state_t)
            probs = dist.probs.squeeze(0).cpu().numpy()
            if np.isnan(probs).any():
                probs = np.ones(self.action_dim, dtype=np.float32) / self.action_dim
            if recent_actions:
                for act in recent_actions[-3:]:
                    if act < len(probs):
                        probs[act] *= 0.1
        return np.argsort(probs)[::-1][:top_k].tolist()

    def save(self, filepath: str):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        torch.save({
            "state_dim": self.state_dim,
            "action_dim": self.action_dim,
            "network_state_dict": self.network.state_dict(),
            "optimizer_state_dict": self.optimizer.state_dict(),
            "is_trained": self.is_trained
        }, filepath)

    def load(self, filepath: str):
        checkpoint = torch.load(filepath, map_location=self.device)
        self.state_dim = checkpoint["state_dim"]
        self.action_dim = checkpoint["action_dim"]
        self.network.load_state_dict(checkpoint["network_state_dict"])
        self.optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
        self.is_trained = checkpoint.get("is_trained", True)
        self.network.eval()
        return self
