"""
Collaborative Filtering Baseline Recommendation Model.
Implements Item-Based Collaborative Filtering and Matrix Factorization baseline.
"""

import os
import json
import pickle
import numpy as np
from typing import List, Dict, Any, Optional

class CollaborativeFilteringModel:
    """
    Item-Based Collaborative Filtering & Matrix Factorization Baseline.
    Learns user-item interaction affinities and item similarity matrix.
    """
    def __init__(self, num_users: int = 200, num_items: int = 100, n_factors: int = 20):
        self.num_users = num_users
        self.num_items = num_items
        self.n_factors = n_factors
        self.similarity_matrix = np.zeros((num_items, num_items), dtype=np.float32)
        self.item_popularity = np.zeros(num_items, dtype=np.float32)
        self.user_latent = np.random.normal(0, 0.1, (num_users + 1, n_factors)).astype(np.float32)
        self.item_latent = np.random.normal(0, 0.1, (num_items, n_factors)).astype(np.float32)
        self.is_trained = False

    def fit(self, user_profiles: Dict[int, Any], items: List[Dict[str, Any]], epochs: int = 30, lr: float = 0.01, reg: float = 0.02):
        """Fit Matrix Factorization and Item Similarity on historical interactions."""
        # 1. Build interaction matrix
        R = np.zeros((self.num_users + 1, self.num_items), dtype=np.float32)
        
        for uid, prof in user_profiles.items():
            u_idx = min(int(uid), self.num_users)
            for act, r in zip(prof.get("interactions", []), prof.get("ratings", [])):
                if act < self.num_items:
                    R[u_idx, act] = float(r)
                    self.item_popularity[act] += 1.0

        # Normalize popularity
        max_pop = max(1.0, np.max(self.item_popularity))
        self.item_popularity /= max_pop

        # 2. Compute Item-Item Cosine Similarity Matrix
        item_norms = np.linalg.norm(R, axis=0) + 1e-8
        self.similarity_matrix = np.dot(R.T, R) / np.outer(item_norms, item_norms)
        np.fill_diagonal(self.similarity_matrix, 0.0)

        # 3. SGD Matrix Factorization for Latent Factors
        training_samples = []
        for u in range(1, self.num_users + 1):
            for i in range(self.num_items):
                if R[u, i] > 0:
                    training_samples.append((u, i, R[u, i]))

        for ep in range(epochs):
            np.random.shuffle(training_samples)
            total_loss = 0.0
            for u, i, r in training_samples:
                pred = float(np.dot(self.user_latent[u], self.item_latent[i]))
                err = r - pred
                total_loss += err ** 2
                
                # Gradient update
                self.user_latent[u] += lr * (err * self.item_latent[i] - reg * self.user_latent[u])
                self.item_latent[i] += lr * (err * self.user_latent[u] - reg * self.item_latent[i])

        self.is_trained = True
        return self

    def predict_scores(self, user_id: int, user_history: List[int]) -> np.ndarray:
        """Predict preference scores for all items."""
        u_idx = min(int(user_id), self.num_users)
        
        # MF score
        mf_scores = np.dot(self.item_latent, self.user_latent[u_idx])
        
        # Item-similarity score from recent history
        if len(user_history) > 0:
            recent = user_history[-5:]
            sim_scores = np.mean(self.similarity_matrix[recent], axis=0)
        else:
            sim_scores = self.item_popularity
            
        combined_scores = 0.6 * mf_scores + 0.4 * sim_scores
        return combined_scores

    def recommend(self, user_id: int, user_history: List[int], top_k: int = 10, exclude_history: bool = True) -> List[int]:
        """Generate top-K recommended item action indices."""
        scores = self.predict_scores(user_id, user_history)
        if exclude_history and len(user_history) > 0:
            for act in set(user_history[-3:]):
                if act < len(scores):
                    scores[act] = -1e9
        top_indices = np.argsort(scores)[::-1][:top_k].tolist()
        return top_indices

    def select_action(self, user_id: int, user_history: List[int]) -> int:
        """Select single best recommendation action."""
        recs = self.recommend(user_id, user_history, top_k=1)
        return recs[0] if len(recs) > 0 else 0

    def save(self, filepath: str):
        """Save model parameters."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "wb") as f:
            pickle.dump({
                "num_users": self.num_users,
                "num_items": self.num_items,
                "n_factors": self.n_factors,
                "similarity_matrix": self.similarity_matrix,
                "item_popularity": self.item_popularity,
                "user_latent": self.user_latent,
                "item_latent": self.item_latent,
                "is_trained": self.is_trained
            }, f)

    def load(self, filepath: str):
        """Load model parameters."""
        with open(filepath, "rb") as f:
            data = pickle.load(f)
            self.num_users = data["num_users"]
            self.num_items = data["num_items"]
            self.n_factors = data["n_factors"]
            self.similarity_matrix = data["similarity_matrix"]
            self.item_popularity = data["item_popularity"]
            self.user_latent = data["user_latent"]
            self.item_latent = data["item_latent"]
            self.is_trained = data["is_trained"]
        return self
