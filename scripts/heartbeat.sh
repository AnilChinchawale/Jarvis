#!/bin/bash
# heartbeat.sh - Agent heartbeat script
# Usage: ./heartbeat.sh <agent-name>

AGENT_NAME="${1:-jarvis}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
MEMORY_DIR="$WORKSPACE_DIR/memory"
LOG_FILE="$MEMORY_DIR/heartbeat.log"

# Ensure memory directory exists
mkdir -p "$MEMORY_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$AGENT_NAME] $1" | tee -a "$LOG_FILE"
}

log "=== Heartbeat Started ==="

# Update agent last_seen in Mission Control
cd "$WORKSPACE_DIR/mission-control"

# Check for notifications
NOTIFICATIONS=$(npx tsx src/index.ts notify list --agent "$AGENT_NAME" --unread 2>/dev/null | head -20)
NOTIFY_COUNT=$(npx tsx src/index.ts notify count --agent "$AGENT_NAME" 2>/dev/null || echo "0")

if [ "$NOTIFY_COUNT" -gt 0 ]; then
    log "📬 $NOTIFY_COUNT unread notifications"
    log "$NOTIFICATIONS"
fi

# Check for assigned tasks
TASKS=$(npx tsx src/index.ts task list --assignee "$AGENT_NAME" --status assigned,in_progress,blocked 2>/dev/null)
if [ -n "$TASKS" ]; then
    log "📋 Active tasks:"
    log "$TASKS"
fi

# Update heartbeat state
STATE_FILE="$MEMORY_DIR/heartbeat-state.json"
if [ -f "$STATE_FILE" ]; then
    # Update existing state
    jq --arg agent "$AGENT_NAME" --arg time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
       '.[$agent] = {"lastHeartbeat": $time, "status": "HEARTBEAT_OK"}' \
       "$STATE_FILE" > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
else
    # Create new state file
    echo "{\"$AGENT_NAME\": {\"lastHeartbeat\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"status\": \"HEARTBEAT_OK\"}}" > "$STATE_FILE"
fi

log "=== Heartbeat Complete ==="

# Return standard heartbeat response
if [ "$NOTIFY_COUNT" -eq 0 ]; then
    echo "HEARTBEAT_OK"
else
    echo "HEARTBEAT_ACTION_REQUIRED"
fi
