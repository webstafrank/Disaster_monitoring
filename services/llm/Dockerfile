# The narrative service shells out to the `claude` CLI. Two deploy options on the
# physical server:
#
#   A. Run on the host (recommended): python venv + `claude` already authenticated
#      for the service user. No container auth headaches. See services/llm/README.md.
#
#   B. Container (this image): installs Node + Claude Code. You MUST mount the
#      authenticated Claude config read-only, e.g.
#        volumes: ["/home/svc/.claude:/root/.claude:ro"]
#      Without that mount, set LLM_MODE=stub.

FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g @anthropic-ai/claude-code \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app

EXPOSE 8100
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8100"]
