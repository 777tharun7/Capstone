"""
FastAPI Route Endpoints for RL Recommendation System.
"""

import os
import json
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.database.models import UserModel, ItemModel, InteractionModel, RecommendationModel, ExperimentResultModel
from backend.recommendation.engine import RecommendationEngine
from backend.recommendation.reward import DEFAULT_REWARD_WEIGHTS
from backend.api.schemas import (
    RecommendRequest, RecommendResponse,
    InteractRequest, InteractResponse,
    ModelSelectRequest, TrainRequest,
    RewardWeightsUpdate, ResetSessionRequest
)

router = APIRouter(prefix="/api", tags=["recommendation"])
engine = RecommendationEngine.get_instance()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXPERIMENTS_DIR = os.path.join(BASE_DIR, "experiments")
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models")

@router.post("/recommend", response_model=RecommendResponse)
def get_recommendations(req: RecommendRequest, db: Session = Depends(get_db)):
    """Generate recommendations for user based on current state and active model."""
    try:
        result = engine.get_recommendations(
            user_id=req.user_id,
            model_name=req.model_name,
            top_k=req.top_k
        )
        
        # Log top recommendation to DB asynchronously / synchronously
        top_rec = result["recommendations"][0] if result["recommendations"] else None
        if top_rec:
            rec_log = RecommendationModel(
                user_id=req.user_id,
                item_id=top_rec["action_id"],
                model_name=result["active_model"],
                rank=1,
                score=top_rec["match_score"]
            )
            db.add(rec_log)
            db.commit()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")

@router.post("/interact", response_model=InteractResponse)
def record_user_interaction(req: InteractRequest, db: Session = Depends(get_db)):
    """Record interaction event, compute immediate/delayed rewards, update MDP state."""
    try:
        result = engine.record_interaction(
            user_id=req.user_id,
            action_id=req.action_id,
            interaction_type=req.interaction_type,
            model_name=req.model_name
        )

        # Store in database
        interaction_log = InteractionModel(
            user_id=req.user_id,
            item_id=req.action_id,
            interaction_type=req.interaction_type,
            reward=result["reward"],
            session_step=result["session_step"],
            model_name=req.model_name or engine.active_model_name
        )
        db.add(interaction_log)
        db.commit()

        return result
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Interaction tracking error: {str(e)}")

REAL_USER_NAMES = {
    1: "Tharun Devanboina",
    2: "Alex Morgan",
    3: "Sarah Connor",
    4: "David Miller",
    5: "Elena Rostova",
    6: "Marcus Chen",
    7: "Priya Sharma",
    8: "Sophia Taylor",
    9: "James Wilson",
    10: "Emily Watson",
    11: "Michael Scott",
    12: "Rachel Green",
    13: "Liam Neeson",
    14: "Daniel Craig",
    15: "Olivia Wilde",
    16: "Lucas Silva",
}

def get_real_name(user_id: int) -> str:
    if user_id in REAL_USER_NAMES:
        return REAL_USER_NAMES[user_id]
    fallback_names = [
        "James Wilson", "Emily Watson", "Michael Scott", "Rachel Green", 
        "Liam Neeson", "Daniel Craig", "Olivia Wilde", "Lucas Silva",
        "Emma Johnson", "Noah Williams", "Ava Brown", "Ethan Davis"
    ]
    return fallback_names[(user_id - 1) % len(fallback_names)]

@router.get("/user/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """Retrieve user preferences, dynamic session status, and interaction history."""
    sess = engine.get_or_create_user_session(user_id)
    user_db = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    
    genres = [
        "unknown", "Action", "Adventure", "Animation", "Children's", "Comedy",
        "Crime", "Documentary", "Drama", "Fantasy", "Film-Noir", "Horror",
        "Musical", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"
    ]
    
    affinities = [
        {"genre": g, "affinity": round(float(a), 3)}
        for g, a in zip(genres, sess["dynamic_genre_affinity"])
    ]
    
    return {
        "user_id": user_id,
        "username": get_real_name(user_id),
        "session_step": sess["session_step"],
        "cumulative_reward": round(sess["cumulative_reward"], 2),
        "satisfaction": round(sess["satisfaction"], 2),
        "fatigue": round(sess["fatigue"], 2),
        "interaction_counts": sess["interaction_counts"],
        "recent_history": sess["interaction_history"][-10:],
        "genre_affinities": affinities,
        "saved_items_count": len(sess["saved_items"])
    }

@router.get("/users")
def list_demo_users(limit: int = 50, db: Session = Depends(get_db)):
    """List sample users for research testing."""
    users = db.query(UserModel).limit(limit).all()
    return [
        {
            "user_id": u.user_id,
            "username": get_real_name(u.user_id),
            "total_interactions": u.preferences.get("total_interactions", 0) if u.preferences else 0,
            "avg_rating": u.preferences.get("avg_rating", 3.5) if u.preferences else 3.5
        }
        for u in users
    ]

@router.get("/items")
def list_items(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    genre: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve catalog items with filtering."""
    query = db.query(ItemModel)
    if genre and genre != "All":
        query = query.filter(ItemModel.primary_genre == genre)
    if search:
        query = query.filter(ItemModel.title.ilike(f"%{search}%"))
        
    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": [
            {
                "action_id": i.action_id,
                "item_id": i.original_id,
                "title": i.title,
                "primary_genre": i.primary_genre,
                "genres": i.genres,
                "avg_rating": i.avg_rating,
                "popularity": i.popularity
            }
            for i in items
        ]
    }

@router.get("/item/{action_id}")
def get_item_detail(action_id: int, db: Session = Depends(get_db)):
    """Retrieve single item detailed view."""
    item = db.query(ItemModel).filter(ItemModel.action_id == action_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return {
        "action_id": item.action_id,
        "item_id": item.original_id,
        "title": item.title,
        "primary_genre": item.primary_genre,
        "genres": item.genres,
        "avg_rating": item.avg_rating,
        "popularity": item.popularity,
        "feature_vector": item.feature_vector
    }

@router.get("/model-status")
def get_model_status():
    """Retrieve model training statuses, checkpoint files, and active model."""
    cf_exists = os.path.exists(os.path.join(SAVED_MODELS_DIR, "cf_model", "cf_model.pkl"))
    bandit_exists = os.path.exists(os.path.join(SAVED_MODELS_DIR, "bandit_model", "bandit_model.pkl"))
    dqn_exists = os.path.exists(os.path.join(SAVED_MODELS_DIR, "dqn_model", "dqn_model.pt"))
    ppo_exists = os.path.exists(os.path.join(SAVED_MODELS_DIR, "ppo_model", "ppo_model.pt"))
    
    return {
        "active_model": engine.active_model_name,
        "models": [
            {
                "name": "Collaborative Filtering",
                "type": "Matrix Factorization Baseline",
                "is_trained": cf_exists,
                "checkpoint": "saved_models/cf_model/cf_model.pkl",
                "description": "Recommends based on historical user-item interaction similarities."
            },
            {
                "name": "Contextual Bandit",
                "type": "LinUCB Bandit",
                "is_trained": bandit_exists,
                "checkpoint": "saved_models/bandit_model/bandit_model.pkl",
                "description": "Balances exploration & exploitation to maximize immediate reward without sequential horizon."
            },
            {
                "name": "DQN",
                "type": "Deep Q-Network (Value-Based RL)",
                "is_trained": dqn_exists,
                "checkpoint": "saved_models/dqn_model/dqn_model.pt",
                "description": "Learns Q(s, a) to optimize discounted cumulative rewards using Experience Replay and Target Network."
            },
            {
                "name": "PPO",
                "type": "Proximal Policy Optimization (Actor-Critic RL)",
                "is_trained": ppo_exists,
                "checkpoint": "saved_models/ppo_model/ppo_model.pt",
                "description": "Primary proposed model optimizing sequential engagement & retention via clipped surrogate objective."
            }
        ]
    }

@router.post("/model-select")
def select_model(req: ModelSelectRequest):
    """Switch the active recommendation model."""
    success = engine.set_active_model(req.model_name)
    if not success:
        raise HTTPException(status_code=400, detail=f"Invalid model name: {req.model_name}")
    return {"status": "success", "active_model": engine.active_model_name}

@router.get("/research/comparison")
def get_research_comparison():
    """Retrieve empirical model comparison evaluation metrics."""
    results_path = os.path.join(EXPERIMENTS_DIR, "evaluation_results.json")
    if not os.path.exists(results_path):
        return {
            "status": "not_evaluated",
            "message": "Benchmark evaluation has not been executed yet. Click 'Run Evaluation' in the dashboard.",
            "data": None
        }
    with open(results_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return {
        "status": "ready",
        "data": data
    }

@router.get("/research/training-history")
def get_training_history():
    """Retrieve training curves for all RL models."""
    ppo_hist_path = os.path.join(EXPERIMENTS_DIR, "ppo_training_history.json")
    dqn_hist_path = os.path.join(EXPERIMENTS_DIR, "dqn_training_history.json")
    bandit_hist_path = os.path.join(EXPERIMENTS_DIR, "bandit_training_history.json")

    ppo_hist = json.load(open(ppo_hist_path)) if os.path.exists(ppo_hist_path) else []
    dqn_hist = json.load(open(dqn_hist_path)) if os.path.exists(dqn_hist_path) else []
    bandit_hist = json.load(open(bandit_hist_path)) if os.path.exists(bandit_hist_path) else []

    return {
        "ppo": ppo_hist,
        "dqn": dqn_hist,
        "bandit": bandit_hist
    }

@router.post("/train")
def run_training_job(req: TrainRequest, background_tasks: BackgroundTasks):
    """Trigger training pipeline for specified model."""
    if req.model_name == "PPO":
        from backend.training.train_ppo import train_ppo
        background_tasks.add_task(train_ppo, episodes=req.episodes)
    elif req.model_name == "DQN":
        from backend.training.train_dqn import train_dqn
        background_tasks.add_task(train_dqn, episodes=req.episodes)
    elif req.model_name == "Contextual Bandit":
        from backend.training.train_bandit import train_bandit
        background_tasks.add_task(train_bandit, episodes=req.episodes)
    elif req.model_name == "Collaborative Filtering":
        from backend.training.train_baseline import train_cf
        background_tasks.add_task(train_cf)
    else:
        raise HTTPException(status_code=400, detail="Unknown model name")

    return {
        "status": "started",
        "model": req.model_name,
        "episodes": req.episodes,
        "message": f"Training job started in background for {req.model_name}."
    }

@router.post("/evaluate")
def run_evaluation_job(background_tasks: BackgroundTasks, num_sessions: int = 50):
    """Trigger fresh evaluation benchmark across all models."""
    from backend.evaluation.evaluate import run_full_benchmark
    background_tasks.add_task(run_full_benchmark, num_test_sessions=num_sessions)
    return {
        "status": "started",
        "num_sessions": num_sessions,
        "message": "Evaluation benchmark started in background."
    }

@router.post("/reset-session")
def reset_session(req: ResetSessionRequest):
    """Reset user session state for live demo testing."""
    sess = engine.reset_user_session(req.user_id)
    return {"status": "success", "message": f"Session reset for user {req.user_id}", "user_id": req.user_id}

@router.get("/reward-weights")
def get_reward_weights():
    """Get current active reward function weights."""
    return engine.reward_calculator.weights.model_dump()

@router.post("/reward-weights")
def update_reward_weights(weights: RewardWeightsUpdate):
    """Update reward function weights dynamically."""
    engine.reward_calculator.update_weights(weights.model_dump(exclude_unset=True))
    return {
        "status": "updated",
        "weights": engine.reward_calculator.weights.model_dump()
    }
