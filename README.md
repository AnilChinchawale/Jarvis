# Multi-Agent System

A production-ready multi-agent AI system using OpenClaw with task management, agent personalities, and coordinated workflows.

## Quick Start

### 1. Install Dependencies

```bash
cd mission-control
npm install
```

### 2. Initialize Database

```bash
npm run build
npm run db:init
```

### 3. Start Notification Daemon

```bash
npm run daemon
```

### 4. Install Cron Jobs

```bash
crontab scripts/crontab.txt
```

### 5. Test the System

```bash
# Create a test task
mc task create --title "Test task" --assignee jarvis --priority high

# List tasks
mc task list

# Check notifications
mc notify list --agent jarvis
```

## Architecture

```
multi-agent-system/
├── agents/                  # Agent configurations
│   ├── jarvis/             # Squad Lead
│   ├── shuri/              # Product Analyst
│   ├── fury/               # Customer Researcher
│   ├── vision/             # SEO Analyst
│   └── loki/               # Content Writer
├── mission-control/        # Task management CLI
│   ├── src/
│   │   ├── db/            # Database
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utilities
│   │   └── index.ts       # CLI entry
│   └── package.json
├── memory/                 # Shared memory
│   ├── WORKING.md         # Current task state
│   └── YYYY-MM-DD.md      # Daily notes
├── scripts/               # Utility scripts
│   ├── heartbeat.sh       # Agent heartbeat
│   └── crontab.txt        # Cron configuration
├── examples/              # Example workflows
├── docs/                  # Documentation
├── AGENTS.md             # Operating manual
└── HEARTBEAT.md          # Wake procedures
```

## Agent Sessions

| Agent | Session Key | Role |
|-------|-------------|------|
| Jarvis | `agent:main:main` | Squad Lead |
| Shuri | `agent:product-analyst:main` | Product Analyst |
| Fury | `agent:customer-researcher:main` | Customer Researcher |
| Vision | `agent:seo-analyst:main` | SEO Analyst |
| Loki | `agent:content-writer:main` | Content Writer |

## Mission Control CLI

### Task Management

```bash
# Create task
mc task create --title "Research competitors" --assignee fury --priority high

# List tasks
mc task list --status inbox
mc task list --assignee jarvis --priority urgent

# Update task
mc task update TASK-123 --status "in progress"

# Add comment with @mention
mc task comment TASK-123 --from jarvis --message "@fury please prioritize this"

# Complete task
mc task complete TASK-123

# Subscribe to updates
mc task subscribe TASK-123 --agent vision
```

### Notifications

```bash
# Check notifications
mc notify list --agent jarvis --unread

# Mark all as read
mc notify read-all --agent jarvis

# Count unread
mc notify count --agent jarvis
```

### Standup

```bash
# Generate standup
mc standup generate --save

# View dashboard
mc dashboard
```

## Workflows

### Feature Development Workflow

```
1. @Jarvis receives feature request
2. @Jarvis assigns research to @Fury
3. @Fury researches and provides evidence
4. @Jarvis assigns analysis to @Shuri
5. @Shuri analyzes edge cases and UX
6. @Jarvis assigns SEO to @Vision
7. @Vision provides keyword strategy
8. @Jarvis assigns content to @Loki
9. @Loki writes content
10. @Vision reviews SEO optimization
11. @Shuri reviews for edge cases
12. @Jarvis approves and completes
```

### Research Request Workflow

```
1. Any agent: "@Fury, research [topic]"
2. @Fury receives notification
3. @Fury conducts research with sources
4. @Fury adds comment with findings
5. Requesting agent reviews
```

### Content Creation Workflow

```
1. @Jarvis assigns to @Loki with brief
2. @Loki requests SEO brief from @Vision
3. @Vision provides keywords and structure
4. @Loki writes first draft
5. @Shuri reviews for clarity/edge cases
6. @Vision reviews SEO optimization
7. @Loki incorporates feedback
8. @Jarvis approves final content
```

## Memory System

### Daily Notes
- Auto-created: `memory/YYYY-MM-DD.md`
- Raw logs of activity
- Decisions made
- Blockers encountered

### WORKING.md
- Current sprint goals
- Active tasks by agent
- Blocked items
- Upcoming deadlines

### MEMORY.md
- Curated long-term knowledge
- Lessons learned
- Process improvements
- Agent preferences

## Communication

### @Mentions
Use @AgentName in messages to notify:
- `@Jarvis` - Escalations, coordination
- `@Shuri` - Product/UX questions
- `@Fury` - Research requests
- `@Vision` - SEO questions
- `@Loki` - Writing/editing

### Thread Subscriptions
Subscribe to task threads for updates:
```bash
mc task subscribe TASK-123 --agent vision
```

### Message Format
```
[PRIORITY] [FROM→TO] Subject

Body content...

---
Context: [task-id]
Due: [timestamp]
```

## Development

### Adding a New Agent

1. Create `agents/newagent/SOUL.md`
2. Add to `mission-control/src/db/index.ts` agents list
3. Update `AGENTS.md` roster
4. Add to `scripts/crontab.txt`

### Database Schema

See `mission-control/src/db/index.ts` for full schema.

Key tables:
- `agents` - Agent configurations
- `tasks` - Task management
- `messages` - Inter-agent messages
- `notifications` - @mention notifications
- `activities` - Audit log
- `subscriptions` - Thread subscriptions

## Troubleshooting

### Agent not receiving notifications
- Check notification daemon is running: `pgrep -f notification-daemon`
- Check agent inbox: `cat agents/jarvis/inbox.jsonl`
- Verify database: `mc notify list --agent jarvis`

### Cron jobs not running
- Check crontab: `crontab -l`
- Check logs: `tail -f memory/cron-*.log`
- Test manually: `./scripts/heartbeat.sh jarvis`

### Database issues
- Reset database: `rm data/mission-control.db`
- Rebuild: `npm run build && npm run db:init`

## License

MIT
