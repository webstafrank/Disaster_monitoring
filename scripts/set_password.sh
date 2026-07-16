#!/usr/bin/env bash
# Add or update an HTTP basic-auth user for the Nginx gateway.
# Writes an apr1-hashed entry to deploy/auth/.htpasswd (gitignored, never committed).
#
#   ./scripts/set_password.sh <username>            # prompts for the password
#   PASSWORD=secret ./scripts/set_password.sh <username>   # non-interactive
#
# Uses openssl (already on the box); no apache2-utils / htpasswd needed.
# After changing users, reload Nginx:  docker compose exec nginx nginx -s reload
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AUTH_DIR="$ROOT/deploy/auth"
FILE="$AUTH_DIR/.htpasswd"

USER="${1:-}"
if [[ -z "$USER" ]]; then
  echo "usage: $0 <username>" >&2
  exit 1
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "ERROR: openssl not found; cannot hash the password." >&2
  exit 1
fi

PW="${PASSWORD:-}"
if [[ -z "$PW" ]]; then
  read -r -s -p "Password for '$USER': " PW; echo
  read -r -s -p "Confirm: " PW2; echo
  [[ "$PW" == "$PW2" ]] || { echo "ERROR: passwords do not match." >&2; exit 1; }
fi
[[ -n "$PW" ]] || { echo "ERROR: empty password." >&2; exit 1; }

mkdir -p "$AUTH_DIR"
HASH="$(openssl passwd -apr1 "$PW")"

# Replace an existing line for this user, or append a new one.
tmp="$(mktemp)"
if [[ -f "$FILE" ]]; then
  grep -v "^${USER}:" "$FILE" > "$tmp" || true
fi
printf '%s:%s\n' "$USER" "$HASH" >> "$tmp"
mv "$tmp" "$FILE"
chmod 600 "$FILE"

echo "Wrote $USER to $FILE"
echo "Reload nginx to apply:  docker compose exec nginx nginx -s reload"
