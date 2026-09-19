#!/bin/bash
# Keep the campus Vite server up on 0.0.0.0:5173.
set -u
cd /workspace/learning-campus
while true; do
  echo "[dev-watch] starting Vite $(date -Is)"
  npm run dev -- --host 0.0.0.0 --port 5173
  echo "[dev-watch] Vite exited $?; restarting in 1s"
  sleep 1
done
