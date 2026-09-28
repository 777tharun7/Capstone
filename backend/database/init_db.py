"""
Database Initialization and Seed Script.
Creates tables and populates items and users from preprocessed MovieLens data.
"""

import os
import json
from backend.database.database import engine, Base, SessionLocal
from backend.database.models import UserModel, ItemModel, InteractionModel, RecommendationModel, ExperimentResultModel

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")

def init_and_seed_db():
    print("[Database] Initializing schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_items = db.query(ItemModel).count()
        if existing_items > 0:
            print(f"[Database] Database already contains {existing_items} items.")
            return

        items_path = os.path.join(PROCESSED_DIR, "items.json")
        users_path = os.path.join(PROCESSED_DIR, "users.json")

        if not os.path.exists(items_path):
            from data.preprocessing import load_and_preprocess_dataset
            load_and_preprocess_dataset()

        with open(items_path, "r", encoding="utf-8") as f:
            items_data = json.load(f)

        with open(users_path, "r", encoding="utf-8") as f:
            raw_users = json.load(f)

        print(f"[Database] Seeding {len(items_data)} items...")
        for item in items_data:
            item_obj = ItemModel(
                action_id=item["action_id"],
                original_id=item["original_id"],
                title=item["title"],
                primary_genre=item["primary_genre"],
                genres=item["genres"],
                avg_rating=item["avg_rating"],
                popularity=item["popularity"],
                feature_vector=item["feature_vector"]
            )
            db.add(item_obj)

        print(f"[Database] Seeding {len(raw_users)} users...")
        for uid_str, udata in raw_users.items():
            uid = int(uid_str)
            user_obj = UserModel(
                user_id=uid,
                username=f"Research User #{uid}",
                preferences={
                    "genre_affinity": udata["genre_affinity"],
                    "total_interactions": udata["total_interactions"],
                    "avg_rating": udata["avg_rating"]
                }
            )
            db.add(user_obj)

        db.commit()
        print("[Database] Schema creation and seed successfully completed!")
    except Exception as e:
        db.rollback()
        print(f"[Database] Error during seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_and_seed_db()
