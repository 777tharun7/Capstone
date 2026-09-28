"""
Deep Q-Network (DQN) Model for Recommendation System.
Learns Q(s, a) to optimize cumulative discounted future rewards in sequential interactions.
Features:
- Multi-layer Q-Network
- Experience Replay Buffer
- Target Network with soft/hard update
- Epsilon-greedy exploration with decay
- Loss tracking and checkpointing
"""

import os
import random
from collections import deque
from typing import List, Tuple, Dict, Any, Optional

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim

class QNetwork(nn.Module):
    """Deep Q-Network estimating action-values Q(s, a)."""
    def __init__(self, state_dim: int = 48, action_dim: int = 100, hidden_dims: List[int] = [128, 128]):
        super().__init__()
        layers = []
        in_dim = state_dim
        for h_dim in hidden_dims:
            layers.append(nn.Linear(in_dim, h_dim))
            layers.append(nn.LayerNorm(h_dim))
            layers.append(nn.ReLU())
            in_dim = h_dim
        layers.append(nn.Linear(in_dim, action_dim))
        self.network = nn.Sequential(*layers)

    def forward(self, state: torch.Tensor) -> torch.Tensor:
        return self.network(state)

class ReplayBuffer:
    """Experience Replay Buffer for off-policy DQN training."""
    def __init__(self, capacity: int = 20000):
        self.buffer = deque(maxlen=capacity)

    def push(self, state: np.ndarray, action: int, reward: float, next_state: np.ndarray, done: bool):
        self.buffer.append((state, action, reward, next_state, done))

    def sample(self, batch_size: int):
        batch = random.sample(self.buffer, batch_size)
        state, action, reward, next_state, done = zip(*batch)
        return (
            torch.FloatTensor(np.array(state)),
            torch.LongTensor(action),
            torch.FloatTensor(reward),
            torch.FloatTensor(np.array(next_state)),
            torch.FloatTensor(done)
        )

    def __len__(self):
        return len(self.buffer)

class DQNModel:
    """
    Deep Q-Network Reinforcement Learning Agent for Sequential Recommendations.
    """
    def __init__(
        self,
        state_dim: int = 48,
        action_dim: int = 100,
        lr: float = 1e-3,
        gamma: float = 0.95,
        epsilon_start: float = 1.0,
        epsilon_end: float = 0.05,
        epsilon_decay: float = 0.995,
        buffer_capacity: int = 20000,
        batch_size: int = 64,
        target_update_freq: int = 10,
        device: Optional[str] = None
    ):
        self.state_dim = state_dim
        self.action_dim = action_dim
        self.gamma = gamma
        self.epsilon = epsilon_start
        self.epsilon_start = epsilon_start
        self.epsilon_end = epsilon_end
        self.epsilon_decay = epsilon_decay
        self.batch_size = batch_size
        self.target_update_freq = target_update_freq
        self.total_steps = 0
        
        self.device = torch.device(device if device else ("cuda" if torch.cuda.is_available() else "cpu"))

        # Primary and Target Q-Networks
        self.q_net = QNetwork(state_dim, action_dim).to(self.device)
        self.target_net = QNetwork(state_dim, action_dim).to(self.device)
        self.target_net.load_state_dict(self.q_net.state_dict())
        self.target_net.eval()

        self.optimizer = optim.Adam(self.q_net.parameters(), lr=lr)
        self.loss_fn = nn.SmoothL1Loss()  # Huber loss
        self.replay_buffer = ReplayBuffer(capacity=buffer_capacity)
        self.is_trained = False

    def select_action(self, state: np.ndarray, evaluate: bool = False) -> Tuple[int, Dict[str, Any]]:
        """
        Select recommendation action using epsilon-greedy policy.
        
        Returns:
            Tuple of (action_index, debug_info_with_q_values)
        """
        state_t = torch.FloatTensor(state).unsqueeze(0).to(self.device)
        with torch.no_grad():
            q_values = self.q_net(state_t).squeeze(0).cpu().numpy()

        is_exploration = False
        if not evaluate and random.random() < self.epsilon:
            action = random.randrange(self.action_dim)
            is_exploration = True
        else:
            action = int(np.argmax(q_values))

        top_actions = np.argsort(q_values)[::-1][:5].tolist()
        top_q_vals = [float(q_values[a]) for a in top_actions]

        info = {
            "selected_action": action,
            "q_value": float(q_values[action]),
            "max_q_value": float(np.max(q_values)),
            "is_exploration": is_exploration,
            "epsilon": round(float(self.epsilon), 4),
            "top_actions": top_actions,
            "top_q_values": top_q_vals,
            "q_values_distribution": [round(float(q), 3) for q in q_values[:15]]  # sample preview
        }
        return action, info

    def store_transition(self, state: np.ndarray, action: int, reward: float, next_state: np.ndarray, done: bool):
        """Add step transition to replay buffer."""
        self.replay_buffer.push(state, action, reward, next_state, done)
        self.total_steps += 1

    def train_step(self) -> Optional[float]:
        """Perform one mini-batch gradient descent step on Bellman error."""
        if len(self.replay_buffer) < self.batch_size:
            return None

        states, actions, rewards, next_states, dones = self.replay_buffer.sample(self.batch_size)
        states = states.to(self.device)
        actions = actions.unsqueeze(1).to(self.device)
        rewards = rewards.unsqueeze(1).to(self.device)
        next_states = next_states.to(self.device)
        dones = dones.unsqueeze(1).to(self.device)

        # Q(s, a)
        curr_q = self.q_net(states).gather(1, actions)

        # Target Q = r + gamma * max_a' Q_target(s', a') * (1 - done)
        with torch.no_grad():
            next_q = self.target_net(next_states).max(1)[0].unsqueeze(1)
            target_q = rewards + (1.0 - dones) * self.gamma * next_q

        loss = self.loss_fn(curr_q, target_q)

        self.optimizer.zero_grad()
        loss.backward()
        torch.nn.utils.clip_grad_norm_(self.q_net.parameters(), max_norm=10.0)
        self.optimizer.step()

        # Update target network periodically
        if self.total_steps % self.target_update_freq == 0:
            self.target_net.load_state_dict(self.q_net.state_dict())

        # Decay exploration
        self.epsilon = max(self.epsilon_end, self.epsilon * self.epsilon_decay)
        self.is_trained = True

        return float(loss.item())

    def recommend(self, state: np.ndarray, top_k: int = 10) -> List[int]:
        """Rank top-K recommended items based on Q-values."""
        state_t = torch.FloatTensor(state).unsqueeze(0).to(self.device)
        with torch.no_grad():
            q_values = self.q_net(state_t).squeeze(0).cpu().numpy()
        return np.argsort(q_values)[::-1][:top_k].tolist()

    def save(self, filepath: str):
        """Save model checkpoint."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        torch.save({
            "state_dim": self.state_dim,
            "action_dim": self.action_dim,
            "q_net_state_dict": self.q_net.state_dict(),
            "target_net_state_dict": self.target_net.state_dict(),
            "optimizer_state_dict": self.optimizer.state_dict(),
            "epsilon": self.epsilon,
            "total_steps": self.total_steps,
            "is_trained": self.is_trained
        }, filepath)

    def load(self, filepath: str):
        """Load model checkpoint."""
        checkpoint = torch.load(filepath, map_location=self.device)
        self.state_dim = checkpoint["state_dim"]
        self.action_dim = checkpoint["action_dim"]
        self.q_net.load_state_dict(checkpoint["q_net_state_dict"])
        self.target_net.load_state_dict(checkpoint["target_net_state_dict"])
        self.optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
        self.epsilon = checkpoint.get("epsilon", self.epsilon_end)
        self.total_steps = checkpoint.get("total_steps", 0)
        self.is_trained = checkpoint.get("is_trained", True)
        self.q_net.eval()
        self.target_net.eval()
        return self
