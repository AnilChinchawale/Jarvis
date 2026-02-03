#!/bin/bash
# quick-task.sh - Quick task creation helper
# Usage: ./quick-task.sh "title" assignee priority

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"

cd "$WORKSPACE_DIR/mission-control"

TITLE="${1:-Quick task}"
ASSIGNEE="${2:-jarvis}"
PRIORITY="${3:-normal}"

node dist/index.js task create \
  --title "$TITLE" \
  --assignee "$ASSIGNEE" \
  --priority "$PRIORITY"
