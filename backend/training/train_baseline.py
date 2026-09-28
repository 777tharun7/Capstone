"""
Training Pipeline for Collaborative Filtering Baseline.
Trains matrix factorization & item similarity on processed MovieLens dataset and saves weights.
"""

import os
import json
import numpy as np
from backend.models.collaborative_filtering import CollaborativeFilteringModel
from data.preprocessing import load_and_preprocess_dataset

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROCESSED_DATA_DIR = os.path.join(BASE_DIR, "data", "processed")
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models", "cf_model")

def train_cf(epochs: int = 35, lr: float = 0.01):
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    
    # Load dataset
    items_path = os.path.join(PROCESSED_DATA_DIR, "items.json")
    users_path = os.path.join(PROCESSED_DATA_DIR, "users.json")
    if not os.path.exists(items_path):
        data_dict = load_and_preprocess_dataset()
        items = data_dict["items"]
        users = data_dict["users"]
    else:
        with open(items_path, "r", encoding="utf-8") as f:
            items = json.load(f)
        with open(users_path, "r", encoding="utf-8") as f:
            raw_users = json.load(f)
            users = {int(k): v for k, v in raw_users.items()}

    print(f"[Train CF] Training Collaborative Filtering on {len(users)} users and {len(items)} items...")
    model = CollaborativeFilteringModel(num_users=len(users), num_items=len(items))
    model.fit(users, items, epochs=epochs, lr=lr)
    
    save_path = os.path.join(SAVED_MODELS_DIR, "cf_model.pkl")
    model.save(save_path)
    print(f"[Train CF] Model saved successfully to {save_path}")
    return model

if __name__ == "__main__":
    train_cf()
