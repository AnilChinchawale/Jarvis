# API Reference - Mission Control CLI

Complete reference for the `mc` command-line interface.

## Global Options

```bash
mc --version          # Show version
mc --help            # Show help
mc [command] --help  # Show command help
```

## Task Commands

### `mc task create`

Create a new task.

```bash
mc task create \
  --title "Task title" \
  [--description "Description"] \
  [--assignee agent-name] \
  [--priority urgent|high|normal|low] \
  [--due YYYY-MM-DD] \
  [--tags tag1 tag2]
```

**Examples:**
```bash
# Simple task
mc task create --title "Review proposal"

# Full task
mc task create \
  --title "Research market" \
  --description "Analyze competitors" \
  --assignee fury \
  --priority high \
  --due 2025-02-10 \
  --tags research market
```

### `mc task list`

List tasks with optional filters.

```bash
mc task list \
  [--status inbox|assigned|in_progress|blocked|review|done|cancelled] \
  [--assignee agent-name] \
  [--priority urgent|high|normal|low] \
  [--limit number]
```

**Examples:**
```bash
# All tasks
mc task list

# Jarvis's urgent tasks
mc task list --assignee jarvis --priority urgent

# Blocked tasks
mc task list --status blocked

# Recent tasks (top 10)
mc task list --limit 10
```

### `mc task get`

Get detailed information about a task.

```bash
mc task get TASK-XXX
```

**Output:**
- Task details
- Comments
- Activity log

### `mc task update`

Update task properties.

```bash
mc task update TASK-XXX \
  [--title "New title"] \
  [--description "New desc"] \
  [--assignee agent-name] \
  [--status status] \
  [--priority priority] \
  [--due YYYY-MM-DD]
```

**Examples:**
```bash
# Change status
mc task update TASK-XXX --status "in_progress"

# Reassign
mc task update TASK-XXX --assignee shuri

# Multiple updates
mc task update TASK-XXX --priority urgent --due 2025-02-01
```

### `mc task comment`

Add a comment to a task. @mentions are parsed and notifications sent.

```bash
mc task comment TASK-XXX \
  --from agent-name \
  --message "Comment text with @mentions"
```

**Examples:**
```bash
mc task comment TASK-XXX \
  --from jarvis \
  --message "@fury please prioritize this research"
```

### `mc task complete`

Mark a task as complete (shorthand for update --status done).

```bash
mc task complete TASK-XXX
```

### `mc task subscribe` / `mc task unsubscribe`

Subscribe or unsubscribe from task notifications.

```bash
mc task subscribe TASK-XXX --agent agent-name
mc task unsubscribe TASK-XXX --agent agent-name
```

## Notification Commands

### `mc notify list`

List notifications.

```bash
mc notify list \
  [--agent agent-name] \
  [--unread] \
  [--limit number]
```

**Examples:**
```bash
# All notifications
mc notify list

# Unread for specific agent
mc notify list --agent jarvis --unread
```

### `mc notify read`

Mark a notification as read.

```bash
mc notify read NOTIF-XXX
```

### `mc notify read-all`

Mark all notifications as read for an agent.

```bash
mc notify read-all --agent agent-name
```

### `mc notify clear`

Clear all notifications for an agent.

```bash
mc notify clear --agent agent-name
```

### `mc notify count`

Count unread notifications for an agent.

```bash
mc notify count --agent agent-name
```

## Standup Commands

### `mc standup generate`

Generate daily standup report.

```bash
mc standup generate [--save]
```

**Examples:**
```bash
# View standup
mc standup generate

# Save to file
mc standup generate --save
```

**Output format:**
```markdown
# Daily Standup - YYYY-MM-DD

## Agent Name
✅ Done:
- Completed task

🔄 In Progress:
- Active task

⚠️ Blockers:
- Blocked task
```

## Dashboard

### `mc dashboard`

Show system overview dashboard.

```bash
mc dashboard
```

**Output:**
- Task counts by status
- Recent activity
- Unread notification summary

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |
| 3 | Database error |
| 4 | Not found |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MC_DB_PATH` | Custom database path |
| `MC_LOG_LEVEL` | Log level (debug/info/warn/error) |
| `MC_NO_COLOR` | Disable colored output |

## Scripting Examples

### Bash Script

```bash
#!/bin/bash

# Create task and capture ID
TASK_ID=$(mc task create --title "Research" --assignee fury --priority high | grep -o 'TASK-[A-Z0-9-]*')

# Add comment
mc task comment "$TASK_ID" --from jarvis --message "Please start ASAP"

# Wait for completion (poll loop)
while true; do
    STATUS=$(mc task get "$TASK_ID" | grep -o 'status: [a-z]*' | cut -d' ' -f2)
    if [ "$STATUS" = "done" ]; then
        echo "Task completed!"
        break
    fi
    sleep 60
done
```

### Check for Urgent Tasks

```bash
#!/bin/bash

URGENT=$(mc task list --priority urgent --limit 1)
if [ -n "$URGENT" ]; then
    echo "⚠️  URGENT tasks pending!"
    echo "$URGENT"
fi
```

### Daily Standup Automation

```bash
#!/bin/bash

# Generate and email standup
mc standup generate --save > /tmp/standup.md
mail -s "Daily Standup $(date +%Y-%m-%d)" team@example.com < /tmp/standup.md
```
