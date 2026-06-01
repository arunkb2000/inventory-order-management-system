#!/usr/bin/env bash
# Post-deploy: verify health and print submission URLs to fill in README
set -euo pipefail

BACKEND_URL="${1:-}"
FRONTEND_URL="${2:-}"

if [[ -z "$BACKEND_URL" ]]; then
  echo "Usage: $0 <BACKEND_URL> [FRONTEND_URL]"
  echo "Example: $0 https://your-app.up.railway.app https://your-app.vercel.app"
  exit 1
fi

BACKEND_URL="${BACKEND_URL%/}"
echo "Checking backend health..."
curl -sf "${BACKEND_URL}/health" | head -c 200
echo ""
echo ""
echo "API docs: ${BACKEND_URL}/docs"
[[ -n "$FRONTEND_URL" ]] && echo "Frontend: ${FRONTEND_URL%/}"
echo ""
echo "Update README.md Live URLs table with these values."
