"""
Gymnasium-Compliant Recommendation Environment for Reinforcement Learning.
Models the recommendation loop as a Markov Decision Process (MDP):
State -> Action -> Reward -> Next State -> Policy Improvement.
"""

import os
import json
import numpy as np
import gymnasium as gym
from gymnasium import spaces
from typing import Dict, Any, Tuple, Optional, List

from backend.recommendation.reward import RewardCalculator, DEFAULT_REWARD_WEIGHTS
from backend.environment.user_simulator import UserSimulator

PROCESSED_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")

class RecommendationEnvironment(gym.Env):
    """
    Sequential Recommendation Gym Environment.
    
    Academic MDP Formulation:
    - State S_t in R^48: Encodes user static/dynamic preferences, recent interaction history embedding,
                         session progress, engagement metrics, and fatigue levels.
    - Action A_t in {0, ..., N-1}: Item candidate to recommend.
    - Transition P(S_{t+1} | S_t, A_t): User state updates based on reaction and recommendation embeddings.
    - Reward R_t: Multi-objective immediate + delayed engagement/retention reward.
    """
    metadata = {"render_modes": ["human"]}

    def __init__(
        self,
        items: Optional[List[Dict[str, Any]]] = None,
        users: Optional[Dict[str, Any]] = None,
        item_features: Optional[np.ndarray] = None,
        max_session_steps: int = 20,
        reward_calculator: Optional[RewardCalculator] = None
    ):
        super().__init__()
        
        # Load dataset if not provided
        if items is None or users is None or item_features is None:
            items_path = os.path.join(PROCESSED_DATA_DIR, "items.json")
            users_path = os.path.join(PROCESSED_DATA_DIR, "users.json")
            feat_path = os.path.join(PROCESSED_DATA_DIR, "item_features.npy")
            
            if not os.path.exists(items_path):
                from data.preprocessing import load_and_preprocess_dataset
                data_dict = load_and_preprocess_dataset()
                self.items = data_dict["items"]
                self.users = data_dict["users"]
                self.item_features = data_dict["item_features"]
            else:
                with open(items_path, "r", encoding="utf-8") as f:
                    self.items = json.load(f)
                with open(users_path, "r", encoding="utf-8") as f:
                    raw_users = json.load(f)
                    self.users = {int(k): v for k, v in raw_users.items()}
                self.item_features = np.load(feat_path)
        else:
            self.items = items
            self.users = users
            self.item_features = item_features

        self.num_items = len(self.items)
        self.num_users = len(self.users)
        self.max_session_steps = max_session_steps
        self.reward_calculator = reward_calculator or RewardCalculator()
        
        # State space: 48-dimensional continuous vector
        # [1 (uid_norm), 19 (genre_affinity), 21 (recent_embedding), 7 (session_dynamics)]
        self.state_dim = 48
        self.observation_space = spaces.Box(
            low=-5.0, high=5.0, shape=(self.state_dim,), dtype=np.float32
        )
        # Action space: Discrete choice of item index 0..num_items-1
        self.action_space = spaces.Discrete(self.num_items)

        # Internal tracking
        self.current_user_id = None
        self.user_simulator = None
        self.current_step = 0
        self.history_actions = []
        self.interaction_counts = {"click": 0, "like": 0, "share": 0, "skip": 0, "meaningful_interaction": 0}
        self.cumulative_reward = 0.0

    def _get_state_vector(self) -> np.ndarray:
        """Construct the 48-dimensional numerical state representation."""
        # 1. Normalized User ID (1 dim)
        uid_norm = np.array([float(self.current_user_id) / max(1, self.num_users)], dtype=np.float32)
        
        # 2. Dynamic Genre Affinity (19 dims)
        genre_affinity = self.user_simulator.dynamic_genre_affinity.astype(np.float32)
        
        # 3. Recent History Embedding (21 dims)
        if len(self.history_actions) > 0:
            recent = self.history_actions[-5:]
            recent_feats = np.mean([self.item_features[a] for a in recent], axis=0).astype(np.float32)
        else:
            recent_feats = np.zeros(21, dtype=np.float32)
            
        # 4. Session Dynamics (7 dims)
        step_norm = float(self.current_step) / self.max_session_steps
        consec_skips_norm = float(self.user_simulator.consecutive_skips) / 5.0
        satisfaction = float(self.user_simulator.cumulative_satisfaction)
        fatigue = float(self.user_simulator.fatigue)
        
        total_acts = max(1, self.current_step)
        click_ratio = float(self.interaction_counts["click"]) / total_acts
        like_ratio = float(self.interaction_counts["like"] + self.interaction_counts["share"]) / total_acts
        skip_ratio = float(self.interaction_counts["skip"]) / total_acts
        
        session_dynamics = np.array([
            step_norm, consec_skips_norm, satisfaction, fatigue,
            click_ratio, like_ratio, skip_ratio
        ], dtype=np.float32)
        
        state_vec = np.concatenate([uid_norm, genre_affinity, recent_feats, session_dynamics])
        return state_vec.astype(np.float32)

    def reset(
        self,
        seed: Optional[int] = None,
        options: Optional[Dict[str, Any]] = None
    ) -> Tuple[np.ndarray, Dict[str, Any]]:
        """Reset environment to begin a new recommendation session."""
        super().reset(seed=seed)
        
        # Select user
        if options and "user_id" in options:
            self.current_user_id = int(options["user_id"])
        else:
            user_keys = list(self.users.keys())
            self.current_user_id = int(np.random.choice(user_keys))
            
        user_profile = self.users.get(self.current_user_id, self.users[list(self.users.keys())[0]])
        self.user_simulator = UserSimulator(user_profile, self.items, self.item_features)
        
        self.current_step = 0
        self.history_actions = []
        self.interaction_counts = {"click": 0, "like": 0, "share": 0, "skip": 0, "meaningful_interaction": 0}
        self.cumulative_reward = 0.0
        
        state = self._get_state_vector()
        info = {
            "user_id": self.current_user_id,
            "session_step": 0,
            "initial_genre_affinity": self.user_simulator.base_genre_affinity.tolist()
        }
        return state, info

    def step(self, action: int) -> Tuple[np.ndarray, float, bool, bool, Dict[str, Any]]:
        """
        Execute one recommendation step in MDP.
        
        Returns:
            (next_state, reward, terminated, truncated, info)
        """
        action = int(action)
        if action < 0 or action >= self.num_items:
            raise ValueError(f"Action {action} out of bounds for space size {self.num_items}")

        self.current_step += 1
        
        # 1. Simulate user response
        interaction_type, satisfaction, user_exited, sim_meta = self.user_simulator.step(action)
        
        if interaction_type in self.interaction_counts:
            self.interaction_counts[interaction_type] += 1
            
        # 2. Calculate decomposed reward
        is_repeated = sim_meta["is_repeated"]
        is_novel = sim_meta["is_novel"]
        session_extended = (self.current_step >= 10 and not user_exited)
        
        reward_info = self.reward_calculator.calculate_reward(
            interaction_type=interaction_type,
            session_step=self.current_step,
            is_repeated=is_repeated,
            is_novel=is_novel,
            user_satisfaction=satisfaction,
            session_extended=session_extended
        )
        step_reward = reward_info["total_reward"]
        self.cumulative_reward += step_reward
        self.history_actions.append(action)

        # 3. Check termination conditions
        terminated = user_exited
        truncated = (self.current_step >= self.max_session_steps)

        # 4. Construct next state
        next_state = self._get_state_vector()

        item_meta = self.items[action]
        info = {
            "user_id": self.current_user_id,
            "action": action,
            "item_title": item_meta["title"],
            "item_genre": item_meta["primary_genre"],
            "interaction": interaction_type,
            "reward": step_reward,
            "reward_breakdown": reward_info,
            "cumulative_reward": round(self.cumulative_reward, 4),
            "session_step": self.current_step,
            "user_satisfaction": satisfaction,
            "simulator_meta": sim_meta
        }

        return next_state, step_reward, terminated, truncated, info

    def render(self):
        print(f"[RecommendationEnv] Step {self.current_step}/{self.max_session_steps} | User {self.current_user_id} | CumReward: {self.cumulative_reward:.2f}")
