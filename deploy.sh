#!/usr/bin/env bash
# On-prem deploy. Pull, build, restart, health-check. Run on the server.
set -euo pipefail

cd "$(dirname "$0")"

if [[ ! -f .env ]]; then
  echo "ERROR: .env missing. Copy .env.example to .env and fill it in." >&2
  exit 1
fi

if [[ ! -s deploy/auth/.htpasswd ]]; then
  echo "ERROR: deploy/auth/.htpasswd missing. Nginx basic auth would lock everyone out." >&2
  echo "       Create a user first:  ./scripts/set_password.sh <username>" >&2
  exit 1
fi

echo "[1/4] Pulling latest..."
git pull --ff-only

echo "[2/4] Building and starting services..."
docker compose --env-file .env up -d --build

echo "[3/4] Waiting for the stack to report ready..."
# /api/ready is a deep probe: it returns 503 until the data source, llm and
# forecast services are all reachable, so this gates on the whole stack, not just
# the API process being up.
for i in $(seq 1 45); do
  if curl -fsk https://localhost/api/ready >/dev/null 2>&1; then
    echo "    Stack ready."
    break
  fi
  sleep 2
  if [[ "$i" == "45" ]]; then
    echo "    WARNING: stack not ready in 90s. Check: curl -sk https://localhost/api/ready" >&2
  fi
done

echo "[4/4] Status:"
docker compose ps
echo "Done."
