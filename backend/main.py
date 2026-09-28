"""
FastAPI Application Entrypoint for Reinforcement Learning-Based Adaptive Recommendation System.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.database.init_db import init_and_seed_db
from backend.recommendation.engine import RecommendationEngine
from backend.api.routes import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize SQLite database and warm up models
    print("[Server] Starting up: initializing database and preprocessed dataset...")
    init_and_seed_db()
    print("[Server] Loading recommendation engine...")
    RecommendationEngine.get_instance()
    yield
    print("[Server] Shutting down.")

app = FastAPI(
    title="RL-Based Adaptive Recommendation System API",
    description="Academic research backend for sequential recommendation with DQN, PPO, Contextual Bandits, and Collaborative Filtering.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API endpoints
app.include_router(router)

@app.get("/api/info")
def system_info():
    return {
        "system": "Reinforcement Learning-Based Adaptive Recommendation System",
        "objective": "Long-Term User Engagement Optimization",
        "status": "operational",
        "docs_url": "/docs",
        "supported_models": ["Collaborative Filtering", "Contextual Bandit", "DQN", "PPO"]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Mount frontend build if available
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    from fastapi.responses import FileResponse
    from fastapi import Request
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/")
    async def root_or_spa(request: Request):
        accept = request.headers.get("accept", "")
        if "application/json" in accept and "text/html" not in accept:
            return system_info()
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return system_info()

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"status": "backend_ready"}
else:
    @app.get("/")
    def root():
        return system_info()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
