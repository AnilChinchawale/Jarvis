#!/bin/bash
# agent-message.sh - Send a message to an agent
# Usage: ./agent-message.sh from-agent to-agent "message"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
MESSAGE_DIR="$WORKSPACE_DIR/messages"

FROM="${1:-jarvis}"
TO="${2:-fury}"
MESSAGE="${3:-Hello!}"

# Create message directory
mkdir -p "$MESSAGE_DIR"

# Generate message ID
MSG_ID="MSG-$(date +%s)-$RANDOM"

# Write message
 cat > "$MESSAGE_DIR/$MSG_ID.json" << EOF
{
  "id": "$MSG_ID",
  "from": "$FROM",
  "to": "$TO",
  "content": "$MESSAGE",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "📨 Message sent: $MSG_ID"
echo "   From: $FROM"
echo "   To: $TO"
echo "   Message: $MESSAGE"
