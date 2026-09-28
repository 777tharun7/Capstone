"""
Reward Function for Reinforcement Learning-Based Adaptive Recommendation System.
Configurable multi-objective engagement and retention reward calculation.
"""

from typing import Dict, Any, List
from pydantic import BaseModel

class RewardWeights(BaseModel):
    """
    Configurable reward weights for experimental tuning.
    Academic Note: These weights steer the agent to optimize long-term engagement
    and user retention rather than naive short-term clickbait/CTR.
    """
    click: float = 1.0
    meaningful_interaction: float = 2.0
    long_session: float = 4.0
    like: float = 3.0
    share: float = 5.0
    retention: float = 10.0
    skip: float = -2.0
    immediate_exit: float = -3.0
    repeated_recommendation_penalty: float = -2.0
    novelty_bonus: float = 0.5
    diversity_bonus: float = 0.5

# Global default reward configuration
DEFAULT_REWARD_WEIGHTS = RewardWeights()

class RewardCalculator:
    def __init__(self, weights: RewardWeights = None):
        self.weights = weights or DEFAULT_REWARD_WEIGHTS

    def update_weights(self, new_weights: Dict[str, float]):
        """Dynamically update reward configuration for experiments."""
        current_dict = self.weights.model_dump()
        for k, v in new_weights.items():
            if k in current_dict:
                current_dict[k] = float(v)
        self.weights = RewardWeights(**current_dict)

    def calculate_reward(
        self,
        interaction_type: str,
        session_step: int,
        is_repeated: bool = False,
        is_novel: bool = True,
        user_satisfaction: float = 0.5,
        session_extended: bool = False
    ) -> Dict[str, Any]:
        """
        Calculate decomposition of immediate reward and long-term retention/engagement reward.
        
        Returns:
            Dict containing:
                - immediate_reward
                - delayed_reward
                - total_reward
                - breakdown: Dict of active components
        """
        immediate = 0.0
        delayed = 0.0
        breakdown = {}

        # 1. Immediate interaction signal
        if interaction_type == "click":
            immediate += self.weights.click
            breakdown["click"] = self.weights.click
        elif interaction_type == "like":
            immediate += self.weights.like
            breakdown["like"] = self.weights.like
        elif interaction_type == "share":
            immediate += self.weights.share
            breakdown["share"] = self.weights.share
        elif interaction_type == "meaningful_interaction":
            immediate += self.weights.meaningful_interaction
            breakdown["meaningful_interaction"] = self.weights.meaningful_interaction
        elif interaction_type == "skip":
            immediate += self.weights.skip
            breakdown["skip"] = self.weights.skip
        elif interaction_type == "exit":
            if session_step <= 2:
                immediate += self.weights.immediate_exit
                breakdown["immediate_exit"] = self.weights.immediate_exit

        # 2. Penalty for fatigue / repeated recommendation
        if is_repeated:
            immediate += self.weights.repeated_recommendation_penalty
            breakdown["repetition_penalty"] = self.weights.repeated_recommendation_penalty

        # 3. Novelty bonus
        if is_novel and interaction_type in ["click", "like", "meaningful_interaction"]:
            immediate += self.weights.novelty_bonus
            breakdown["novelty_bonus"] = self.weights.novelty_bonus

        # 4. Delayed / Long-term Engagement & Retention signals
        if session_step >= 5:
            # Long session reward
            delayed += self.weights.long_session * (min(session_step, 15) / 10.0)
            breakdown["long_session"] = self.weights.long_session * (min(session_step, 15) / 10.0)

        if session_extended and user_satisfaction >= 0.7:
            # High retention probability reward
            delayed += self.weights.retention
            breakdown["retention_bonus"] = self.weights.retention

        total = immediate + delayed

        return {
            "immediate_reward": round(immediate, 4),
            "delayed_reward": round(delayed, 4),
            "total_reward": round(total, 4),
            "breakdown": breakdown
        }
