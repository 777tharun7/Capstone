"""
Unit Tests for Recommendation Models (CF, Bandit, DQN, PPO).
"""

import numpy as np
import torch
from backend.models.collaborative_filtering import CollaborativeFilteringModel
from backend.models.contextual_bandit import ContextualBanditModel
from backend.models.dqn import DQNModel
from backend.models.ppo import PPOModel

def test_collaborative_filtering_model():
    model = CollaborativeFilteringModel(num_users=10, num_items=20, n_factors=8)
    user_profiles = {
        1: {"interactions": [0, 1, 2], "ratings": [5, 4, 5]},
        2: {"interactions": [2, 3, 4], "ratings": [4, 5, 3]}
    }
    items = [{"genre_vector": [0]*19} for _ in range(20)]
    model.fit(user_profiles, items, epochs=5)
    
    recs = model.recommend(user_id=1, user_history=[0], top_k=5)
    assert len(recs) == 5
    assert all(0 <= a < 20 for a in recs)

def test_contextual_bandit_model():
    model = ContextualBanditModel(num_items=20, context_dim=48, alpha=0.5)
    context = np.random.randn(48).astype(np.float32)
    
    action = model.select_action(context)
    assert 0 <= action < 20
    
    model.update(action, context, reward=1.5)
    assert model.is_trained

def test_dqn_model_forward_and_action():
    model = DQNModel(state_dim=48, action_dim=20)
    state = np.random.randn(48).astype(np.float32)
    
    action, info = model.select_action(state, evaluate=True)
    assert 0 <= action < 20
    assert "q_value" in info
    assert "top_actions" in info
    
    # Test transition storage and step
    next_state = np.random.randn(48).astype(np.float32)
    for _ in range(70):
        model.store_transition(state, action, 1.0, next_state, False)
    loss = model.train_step()
    assert loss is not None and not np.isnan(loss)

def test_ppo_model_forward_and_action():
    model = PPOModel(state_dim=48, action_dim=20)
    state = np.random.randn(48).astype(np.float32)
    
    action, info = model.select_action(state, evaluate=True)
    assert 0 <= action < 20
    assert "action_prob" in info
    assert "estimated_value" in info
    
    # Store transitions and train step
    for _ in range(16):
        next_state = np.random.randn(48).astype(np.float32)
        model.store_transition(state, action, 1.0, info["log_prob"], info["estimated_value"], False)
    metrics = model.train_step(next_state, done=True)
    assert "policy_loss" in metrics
