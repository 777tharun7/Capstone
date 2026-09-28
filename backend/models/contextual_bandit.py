"""
Contextual Bandit Recommendation Baseline Model (LinUCB).
Observes current user context vector, selects item maximizing Upper Confidence Bound,
and updates linear parameters to optimize immediate reward.
Does NOT explicitly model sequential multi-step MDP credit assignment.
"""

import os
import pickle
import numpy as np
from typing import List, Dict, Any, Optional

class ContextualBanditModel:
    """
    Linear Upper Confidence Bound (LinUCB) Contextual Bandit.
    
    Academic Note:
    Contextual bandits solve the multi-armed bandit problem with context (features).
    At step t:
        E[r_{t,a} | x_{t,a}] = x_{t,a}^T theta_a
    Action chosen:
        a_t = argmax_a [ x_{t,a}^T \hat{theta}_a + alpha * sqrt( x_{t,a}^T A_a^{-1} x_{t,a} ) ]
    
    Key distinction from RL (DQN/PPO):
    Bandits treat each decision independently and maximize immediate reward (one-step horizon, gamma=0).
    They do not account for state transitions or long-term retention consequences.
    """
    def __init__(self, num_items: int = 100, context_dim: int = 48, alpha: float = 1.0):
        self.num_items = num_items
        self.context_dim = context_dim
        self.alpha = alpha  # Exploration parameter
        
        # LinUCB matrices for each arm a:
        # A_a = d x d identity matrix + sum(x x^T)
        # b_a = d-dimensional vector sum(r * x)
        self.A = [np.identity(self.context_dim, dtype=np.float32) for _ in range(num_items)]
        self.b = [np.zeros((self.context_dim, 1), dtype=np.float32) for _ in range(num_items)]
        self.is_trained = False

    def predict_ucb(self, context: np.ndarray) -> np.ndarray:
        """Calculate UCB score for each candidate arm."""
        x = context.reshape(-1, 1).astype(np.float32)
        ucb_scores = np.zeros(self.num_items, dtype=np.float32)

        for a in range(self.num_items):
            A_inv = np.linalg.inv(self.A[a])
            theta_a = np.dot(A_inv, self.b[a])
            
            # Expected reward + exploration bonus
            mean_est = float(np.dot(theta_a.T, x)[0, 0])
            var_est = float(np.dot(x.T, np.dot(A_inv, x))[0, 0])
            confidence_bound = self.alpha * np.sqrt(max(0.0, var_est))
            
            ucb_scores[a] = mean_est + confidence_bound

        return ucb_scores

    def select_action(self, context: np.ndarray) -> int:
        """Select arm with maximum UCB score."""
        scores = self.predict_ucb(context)
        return int(np.argmax(scores))

    def update(self, action: int, context: np.ndarray, reward: float):
        """Update LinUCB parameters for chosen action upon observing immediate reward."""
        x = context.reshape(-1, 1).astype(np.float32)
        self.A[action] += np.dot(x, x.T)
        self.b[action] += reward * x
        self.is_trained = True

    def recommend(self, context: np.ndarray, top_k: int = 10) -> List[int]:
        """Rank top-K arms according to UCB."""
        scores = self.predict_ucb(context)
        return np.argsort(scores)[::-1][:top_k].tolist()

    def save(self, filepath: str):
        """Save model parameters."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "wb") as f:
            pickle.dump({
                "num_items": self.num_items,
                "context_dim": self.context_dim,
                "alpha": self.alpha,
                "A": self.A,
                "b": self.b,
                "is_trained": self.is_trained
            }, f)

    def load(self, filepath: str):
        """Load model parameters."""
        with open(filepath, "rb") as f:
            data = pickle.load(f)
            self.num_items = data["num_items"]
            self.context_dim = data["context_dim"]
            self.alpha = data["alpha"]
            self.A = data["A"]
            self.b = data["b"]
            self.is_trained = data["is_trained"]
        return self
