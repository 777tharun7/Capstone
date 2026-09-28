"""
Unit Tests for Multi-Objective Configurable Reward Function.
"""

from backend.recommendation.reward import RewardCalculator, RewardWeights

def test_reward_click_calculation():
    calc = RewardCalculator()
    res = calc.calculate_reward(
        interaction_type="click",
        session_step=1,
        is_repeated=False,
        is_novel=True
    )
    assert res["immediate_reward"] > 0
    assert "click" in res["breakdown"]

def test_reward_skip_penalty():
    calc = RewardCalculator()
    res = calc.calculate_reward(
        interaction_type="skip",
        session_step=1,
        is_repeated=False
    )
    assert res["immediate_reward"] < 0
    assert res["total_reward"] < 0

def test_reward_repeated_penalty():
    calc = RewardCalculator()
    res = calc.calculate_reward(
        interaction_type="like",
        session_step=2,
        is_repeated=True,
        is_novel=False
    )
    assert "repetition_penalty" in res["breakdown"]
    assert res["breakdown"]["repetition_penalty"] == calc.weights.repeated_recommendation_penalty

def test_reward_retention_and_long_session():
    calc = RewardCalculator()
    res = calc.calculate_reward(
        interaction_type="meaningful_interaction",
        session_step=10,
        user_satisfaction=0.85,
        session_extended=True
    )
    assert res["delayed_reward"] > 0
    assert "retention_bonus" in res["breakdown"]
    assert "long_session" in res["breakdown"]
