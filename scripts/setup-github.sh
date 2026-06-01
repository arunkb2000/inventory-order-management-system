#!/usr/bin/env bash
# Create GitHub repo and push (requires GitHub CLI: brew install gh && gh auth login)
set -euo pipefail

REPO_NAME="${1:-inventory-order-management-system}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

if ! command -v gh >/dev/null 2>&1; then
  echo "Install GitHub CLI: brew install gh"
  echo "Then run: gh auth login"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote origin already set:"
  git remote -v
else
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
  echo "Created and pushed: https://github.com/$(gh api user -q .login)/${REPO_NAME}"
  exit 0
fi

git push -u origin main
echo "Pushed to origin."
