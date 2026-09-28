"""
Integration Tests for FastAPI Endpoints using TestClient.
"""

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_and_root():
    res = client.get("/api/info")
    assert res.status_code == 200
    assert res.json()["status"] == "operational"

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"

def test_recommend_endpoint():
    payload = {
        "user_id": 1,
        "model_name": "PPO",
        "top_k": 5
    }
    res = client.post("/api/recommend", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["user_id"] == 1
    assert data["active_model"] == "PPO"
    assert len(data["recommendations"]) == 5
    assert "model_metadata" in data

def test_interact_endpoint():
    payload = {
        "user_id": 1,
        "action_id": 0,
        "interaction_type": "like",
        "model_name": "PPO"
    }
    res = client.post("/api/interact", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "reward" in data
    assert "next_state" in data

def test_model_status_and_select():
    res = client.get("/api/model-status")
    assert res.status_code == 200
    data = res.json()
    assert len(data["models"]) == 4

    select_res = client.post("/api/model-select", json={"model_name": "DQN"})
    assert select_res.status_code == 200
    assert select_res.json()["active_model"] == "DQN"

def test_research_comparison_endpoint():
    res = client.get("/api/research/comparison")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ready"
    assert "PPO" in data["data"]
    assert "DQN" in data["data"]
