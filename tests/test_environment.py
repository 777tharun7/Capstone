"""
Unit and Integration Tests for Gymnasium Recommendation Environment.
"""

import numpy as np
import pytest
from backend.environment.recommendation_env import RecommendationEnvironment

def test_environment_initialization():
    env = RecommendationEnvironment()
    assert env.observation_space.shape == (48,)
    assert env.action_space.n == 100
    assert len(env.items) == 100
    assert len(env.users) > 0

def test_environment_reset():
    env = RecommendationEnvironment()
    state, info = env.reset(options={"user_id": 1})
    
    assert isinstance(state, np.ndarray)
    assert state.shape == (48,)
    assert not np.isnan(state).any()
    assert info["user_id"] == 1
    assert info["session_step"] == 0

def test_environment_step():
    env = RecommendationEnvironment()
    state, info = env.reset(options={"user_id": 1})
    
    action = 0
    next_state, reward, terminated, truncated, step_info = env.step(action)
    
    assert isinstance(next_state, np.ndarray)
    assert next_state.shape == (48,)
    assert not np.isnan(next_state).any()
    assert isinstance(reward, float)
    assert isinstance(terminated, bool)
    assert isinstance(truncated, bool)
    assert "interaction" in step_info
    assert "reward_breakdown" in step_info

def test_environment_full_session_rollout():
    env = RecommendationEnvironment(max_session_steps=10)
    state, _ = env.reset()
    
    total_reward = 0.0
    steps = 0
    for _ in range(10):
        action = np.random.randint(0, env.num_items)
        next_state, reward, terminated, truncated, _ = env.step(action)
        total_reward += reward
        steps += 1
        if terminated or truncated:
            break
            
    assert steps <= 10
    assert not np.isnan(total_reward)
