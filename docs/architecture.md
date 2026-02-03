# Multi-Agent System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         HUMAN INTERFACE                                 │
│                    (Main session: agent:main:main)                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MISSION CONTROL                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Tasks     │  │  Messages   │  │ Notifications│  │   Activities    │ │
│  │  (SQLite)   │  │  (SQLite)   │  │  (SQLite)   │  │    (SQLite)     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘ │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                     Notification Daemon                             ││
│  │  - Watches message directory for @mentions                          ││
│  │  - Routes notifications to agent inboxes                            ││
│  │  - Monitors for due task alerts                                     ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│    JARVIS     │        │    SHURI      │        │    FURY       │
│  agent:main   │        │product-analyst│        │customer-research│
│   :main       │        │   :main       │        │   :main       │
│               │        │               │        │               │
│  Squad Lead   │        │  Product/UX   │        │   Research    │
└───────────────┘        └───────────────┘        └───────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
    ┌───────────────┐                              ┌───────────────┐
    │    VISION     │                              │     LOKI      │
    │ seo-analyst   │                              │content-writer │
    │   :main       │                              │   :main       │
    │               │                              │               │
    │  SEO/Keywords │                              │ Writing/Edit  │
    └───────────────┘                              └───────────────┘
```

## Component Details

### Mission Control

Central task management system built with:
- **Database**: SQLite with WAL mode for concurrent access
- **CLI**: TypeScript/Node.js with Commander.js
- **Daemon**: File watcher for @mention routing

### Agent Sessions

Each agent has an independent OpenClaw session:
- Isolated context/memory
- Responds to heartbeats individually
- Communicates via Mission Control

### Communication Flow

```
Agent A wants to notify Agent B:

1. Agent A writes message to messages/MSG-XXX.json
2. Notification daemon detects new file
3. Daemon parses @mentions in message
4. Daemon creates notification in database
5. Daemon appends to Agent B's inbox file
6. Agent B's heartbeat picks up notification
```

### Heartbeat System

```
Cron (every 15 min) → heartbeat.sh → mc CLI → Check notifications
                                              Check tasks
                                              Update state
                                              Log activity
```

## Data Flow

### Task Lifecycle

```
Create → Inbox → Assigned → In Progress → Review → Done
            ↓         ↓           ↓           ↓
         Notify   Log work    Request    Approve
         assignee  activity    review     complete
```

### Message Flow

```
Write → Parse @mentions → Create notifications → Route to agents
                                         ↓
                                    Update inbox
                                         ↓
                                    Heartbeat pickup
```

## File Organization

```
multi-agent-system/
├── agents/              # Agent configs (SOUL.md)
├── mission-control/     # Task management
│   ├── src/
│   │   ├── db/         # Database layer
│   │   ├── services/   # Business logic
│   │   ├── utils/      # Helpers
│   │   └── index.ts    # CLI
│   └── data/           # SQLite database
├── memory/             # Shared memory
│   ├── WORKING.md      # Current state
│   ├── MEMORY.md       # Long-term knowledge
│   ├── YYYY-MM-DD.md   # Daily notes
│   └── heartbeat-state.json
├── messages/           # Inter-agent messages
├── scripts/            # Utilities
│   ├── heartbeat.sh    # Agent wake script
│   └── setup.sh        # Installation
└── docs/               # Documentation
```

## Security Considerations

- Database file permissions: 600 (user-only)
- No external network exposure
- Message sanitization before storage
- Agent isolation prevents context leakage

## Scaling Considerations

Current design supports:
- 5-10 agents comfortably
- 10,000+ tasks
- 100,000+ messages

For larger scale:
- Migrate SQLite to PostgreSQL
- Add Redis for notification queue
- Shard agents across multiple nodes
