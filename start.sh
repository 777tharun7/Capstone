#!/bin/bash
# ==============================================================================
# RL Recommendation Platform - One-Click Launcher
# ==============================================================================

export PATH="$HOME/.local/node/bin:$PATH"
export PYTHONPATH=.

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=========================================================="
echo " Starting RecSys RL - Adaptive Recommendation Platform"
echo "=========================================================="

# 1. Kill any stale processes on ports 8000 or 5173
lsof -ti :8000 | xargs kill -9 2>/dev/null
lsof -ti :5173 | xargs kill -9 2>/dev/null

# 2. Start Backend FastAPI Server
echo "[1/2] Starting Python FastAPI RL Server on port 8000..."
./venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 2

# 3. Start Frontend Vite Server
echo "[2/2] Starting Frontend Vite Dev Server on port 5173..."
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
cd ..

# 4. Open in default browser automatically
sleep 2
echo "----------------------------------------------------------"
echo " Platform is LIVE!"
echo " Frontend URL: http://localhost:5173"
echo " Backend URL:  http://localhost:8000"
echo " Opening browser automatically..."
echo "----------------------------------------------------------"
open http://localhost:5173 2>/dev/null || xdg-open http://localhost:5173 2>/dev/null

# Keep script running
wait $FRONTEND_PID $BACKEND_PID
