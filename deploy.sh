#!/usr/bin/env bash
# On-prem deploy. Pull, build, restart, health-check. Run on the server.
set -euo pipefail

cd "$(dirname "$0")"

if [[ ! -f .env ]]; then
  echo "ERROR: .env missing. Copy .env.example to .env and fill it in." >&2
  exit 1
fi

echo "[1/4] Pulling latest..."
git pull --ff-only

echo "[2/4] Building and starting services..."
docker compose --env-file .env up -d --build

echo "[3/4] Waiting for the API to report healthy..."
for i in $(seq 1 30); do
  if curl -fsk https://localhost/api/health >/dev/null 2>&1; then
    echo "    API healthy."
    break
  fi
  sleep 2
  if [[ "$i" == "30" ]]; then echo "    WARNING: API did not report healthy in 60s." >&2; fi
done

echo "[4/4] Status:"
docker compose ps
echo "Done."
