"""
Pydantic Schemas for API Request / Response Validation.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class RecommendRequest(BaseModel):
    user_id: int = Field(1, description="Target User ID")
    model_name: Optional[str] = Field(None, description="Optional model override: 'Collaborative Filtering', 'Contextual Bandit', 'DQN', 'PPO'")
    top_k: int = Field(10, ge=1, le=50, description="Number of recommendations to return")

class ItemResponse(BaseModel):
    action_id: int
    item_id: int
    title: str
    primary_genre: str
    genres: List[str]
    avg_rating: float
    popularity: float
    rank: int
    is_saved: bool
    policy_probability: float = 0.0
    rl_score: float = 0.0
    predicted_reward: float = 0.0
    value_estimate: float = 0.0
    diversity_impact: float = 0.0
    match_score: float
    explanation: str
    why_recommended: List[str] = []
    feature_contributions: Dict[str, float] = {}

class StateFeatureItem(BaseModel):
    dim: int
    label: str
    value: float
    category: str

class GenreAffinityItem(BaseModel):
    genre: str
    affinity: float

class StateBreakdown(BaseModel):
    user_id_norm: float
    top_genre_affinities: List[GenreAffinityItem]
    recent_engagement: float
    average_rating: float
    diversity_score: float
    recent_ctr: float
    watch_completion: float
    session_length_steps: int
    session_duration_min: int
    satisfaction: float
    fatigue: float
    churn_risk: float

class CriticInfo(BaseModel):
    state_value_v: float
    expected_return: float
    advantage: float
    critic_insight: str

class ActorCandidate(BaseModel):
    action_id: int
    title: str
    genre: str
    probability: float
    rank: int

class ActorInfo(BaseModel):
    policy_name: str
    entropy: float
    exploration_ratio: float
    exploitation_ratio: float
    selected_action_prob: float
    top_candidates: List[ActorCandidate]

class RewardBreakdownInfo(BaseModel):
    immediate_engagement: float
    watch_completion: float
    retention_bonus: float
    diversity_bonus: float
    fatigue_penalty: float
    total_step_reward: float

class RecommendResponse(BaseModel):
    user_id: int
    active_model: str
    session_step: int
    cumulative_reward: float
    user_satisfaction: float
    state_vector_preview: List[float]
    full_state_vector: Optional[List[StateFeatureItem]] = None
    state_breakdown: Optional[StateBreakdown] = None
    critic_info: Optional[CriticInfo] = None
    actor_info: Optional[ActorInfo] = None
    reward_breakdown: Optional[RewardBreakdownInfo] = None
    model_metadata: Dict[str, Any]
    recommendations: List[ItemResponse]

class InteractRequest(BaseModel):
    user_id: int
    action_id: int
    interaction_type: str = Field(..., description="click, like, dislike, skip, save, share, meaningful_interaction, view")
    model_name: Optional[str] = None

class InteractResponse(BaseModel):
    status: str
    user_id: int
    action_id: int
    item_title: str
    interaction_type: str
    reward: float
    reward_breakdown: Dict[str, Any]
    cumulative_reward: float
    session_step: int
    user_satisfaction: float
    current_state: List[float]
    next_state: List[float]

class ModelSelectRequest(BaseModel):
    model_name: str = Field(..., description="'Collaborative Filtering', 'Contextual Bandit', 'DQN', 'PPO'")

class TrainRequest(BaseModel):
    model_name: str
    episodes: int = Field(150, ge=10, le=2000)

class RewardWeightsUpdate(BaseModel):
    click: Optional[float] = None
    meaningful_interaction: Optional[float] = None
    long_session: Optional[float] = None
    like: Optional[float] = None
    share: Optional[float] = None
    retention: Optional[float] = None
    skip: Optional[float] = None
    immediate_exit: Optional[float] = None
    repeated_recommendation_penalty: Optional[float] = None
    novelty_bonus: Optional[float] = None
    diversity_bonus: Optional[float] = None

class ResetSessionRequest(BaseModel):
    user_id: int
