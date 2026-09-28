"""
SQLAlchemy Database Models for RL Recommendation System.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.database import Base

class UserModel(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), default="Demo User")
    preferences = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    interactions = relationship("InteractionModel", back_populates="user")
    recommendations = relationship("RecommendationModel", back_populates="user")

class ItemModel(Base):
    __tablename__ = "items"

    action_id = Column(Integer, primary_key=True, index=True)
    original_id = Column(Integer, index=True)
    title = Column(String(255), nullable=False)
    primary_genre = Column(String(100), nullable=False)
    genres = Column(JSON, default=list)
    avg_rating = Column(Float, default=3.5)
    popularity = Column(Float, default=0.5)
    feature_vector = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    interactions = relationship("InteractionModel", back_populates="item")

class InteractionModel(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("items.action_id"), nullable=False, index=True)
    interaction_type = Column(String(50), nullable=False)  # click, like, dislike, skip, share, view
    reward = Column(Float, default=0.0)
    session_step = Column(Integer, default=1)
    model_name = Column(String(50), default="PPO")
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="interactions")
    item = relationship("ItemModel", back_populates="interactions")

class RecommendationModel(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    item_id = Column(Integer, ForeignKey("items.action_id"), nullable=False)
    model_name = Column(String(50), nullable=False)
    rank = Column(Integer, default=1)
    score = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="recommendations")

class ExperimentResultModel(Base):
    __tablename__ = "experiment_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_name = Column(String(50), nullable=False)
    metric_name = Column(String(50), nullable=False)
    metric_value = Column(Float, nullable=False)
    run_timestamp = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON, default=dict)
