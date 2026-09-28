"""
Offline User Simulator for RL Recommendation Environment.
Simulates realistic user response dynamics (clicks, likes, skips, fatigue, retention)
grounded on historical MovieLens interaction profiles and latent preferences.
"""

import numpy as np
from typing import Dict, Any, Tuple

class UserSimulator:
    """
    Offline user behavior simulator.
    Academic Note: Simulates user behavioral dynamics based on latent preferences,
    item relevance, boredom/fatigue from repetitive recommendations, and session continuation probability.
    """
    def __init__(self, user_profile: Dict[str, Any], items: list, item_features: np.ndarray):
        self.user_id = user_profile.get("user_id", 1)
        self.base_genre_affinity = np.array(user_profile.get("genre_affinity", [1.0/19]*19), dtype=np.float32)
        self.items = items
        self.item_features = item_features
        self.num_items = len(items)

        # Dynamic state for current session
        self.reset_session()

    def reset_session(self):
        """Reset internal session dynamics."""
        self.dynamic_genre_affinity = self.base_genre_affinity.copy()
        self.recent_actions = []
        self.session_step = 0
        self.consecutive_skips = 0
        self.cumulative_satisfaction = 0.5
        self.fatigue = 0.0

    def step(self, action: int) -> Tuple[str, float, bool, Dict[str, Any]]:
        """
        Simulate user reaction to recommended item action.
        
        Returns:
            Tuple of (interaction_type, satisfaction, session_ended, metadata)
        """
        self.session_step += 1
        item = self.items[action]
        genre_vec = np.array(item["genre_vector"], dtype=np.float32)
        
        # 1. Relevance Score (Cosine similarity / Dot product with user preference)
        norm_user = np.linalg.norm(self.dynamic_genre_affinity) + 1e-8
        norm_item = np.linalg.norm(genre_vec) + 1e-8
        genre_match = float(np.dot(self.dynamic_genre_affinity, genre_vec) / (norm_user * norm_item))
        
        # Factor in item quality / popularity
        quality_score = item["avg_rating"] / 5.0 * 0.7 + item["popularity"] * 0.3
        raw_relevance = 0.65 * genre_match + 0.35 * quality_score

        # 2. Repetition & Fatigue Penalty
        is_repeated = action in self.recent_actions[-3:]
        repetition_count = self.recent_actions.count(action)
        fatigue_penalty = 0.3 * repetition_count + self.fatigue
        
        perceived_utility = max(0.0, raw_relevance - fatigue_penalty)

        # 3. Probabilistic Response Generation
        # Add slight stochastic noise
        utility = np.clip(perceived_utility + np.random.normal(0, 0.08), 0.0, 1.0)
        
        is_novel = action not in self.recent_actions
        self.recent_actions.append(action)
        if len(self.recent_actions) > 10:
            self.recent_actions.pop(0)

        # Determine interaction
        if utility > 0.78:
            # High utility -> Like or Share
            interaction_type = np.random.choice(["like", "share", "meaningful_interaction"], p=[0.6, 0.2, 0.2])
            self.consecutive_skips = 0
            self.cumulative_satisfaction = min(1.0, self.cumulative_satisfaction + 0.1)
            # User affinity slightly shifts towards this genre
            self.dynamic_genre_affinity = 0.85 * self.dynamic_genre_affinity + 0.15 * genre_vec
        elif utility > 0.52:
            interaction_type = np.random.choice(["click", "meaningful_interaction"], p=[0.7, 0.3])
            self.consecutive_skips = 0
            self.cumulative_satisfaction = min(1.0, self.cumulative_satisfaction + 0.05)
        elif utility > 0.30:
            interaction_type = "skip"
            self.consecutive_skips += 1
            self.cumulative_satisfaction = max(0.0, self.cumulative_satisfaction - 0.05)
        else:
            interaction_type = "skip" if np.random.rand() > 0.4 else "exit"
            self.consecutive_skips += 1
            self.cumulative_satisfaction = max(0.0, self.cumulative_satisfaction - 0.1)

        # Update fatigue (grows per step, accelerates on skips)
        self.fatigue = min(0.6, self.fatigue + 0.02 + 0.04 * self.consecutive_skips)

        # Determine if user exits
        # Early exit if too many consecutive skips or very low satisfaction
        session_ended = False
        if self.consecutive_skips >= 4 or interaction_type == "exit" or self.cumulative_satisfaction <= 0.15:
            session_ended = True
            interaction_type = "exit"

        metadata = {
            "relevance": round(float(raw_relevance), 4),
            "utility": round(float(utility), 4),
            "is_repeated": is_repeated,
            "is_novel": is_novel,
            "user_satisfaction": round(float(self.cumulative_satisfaction), 4),
            "consecutive_skips": self.consecutive_skips,
            "session_step": self.session_step
        }

        return interaction_type, float(self.cumulative_satisfaction), session_ended, metadata
