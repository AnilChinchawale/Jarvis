# Multi-Agent System - File Index

## Root Files

| File | Purpose |
|------|---------|
| `README.md` | System overview and quick start |
| `AGENTS.md` | Operating manual for all agents |
| `HEARTBEAT.md` | Wake procedures and heartbeat guide |

## Agents Directory (`agents/`)

| File | Purpose |
|------|---------|
| `jarvis/SOUL.md` | Squad Lead agent configuration |
| `shuri/SOUL.md` | Product Analyst agent configuration |
| `fury/SOUL.md` | Customer Researcher agent configuration |
| `vision/SOUL.md` | SEO Analyst agent configuration |
| `loki/SOUL.md` | Content Writer agent configuration |

## Mission Control (`mission-control/`)

### Configuration
| File | Purpose |
|------|---------|
| `package.json` | Node.js dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |

### Source Code (`src/`)
| File | Purpose |
|------|---------|
| `index.ts` | CLI entry point and commands |
| `types.ts` | TypeScript type definitions |
| `db/index.ts` | Database initialization and schema |
| `services/tasks.ts` | Task management service |
| `services/notifications.ts` | Notification service |
| `services/standup.ts` | Daily standup generation |
| `utils/id.ts` | ID generation utilities |
| `utils/format.ts` | Output formatting |
| `daemon/notifications.ts` | Notification daemon |

### Build Output
| File | Purpose |
|------|---------|
| `dist/` | Compiled JavaScript (generated) |
| `data/mission-control.db` | SQLite database (generated) |

## Memory Directory (`memory/`)

| File | Purpose |
|------|---------|
| `WORKING.md` | Current task state and sprint info |
| `MEMORY.md` | Long-term curated knowledge |
| `YYYY-MM-DD.md` | Daily notes template |
| `standups/` | Generated standup reports |
| `heartbeat-state.json` | Agent heartbeat tracking |

## Scripts Directory (`scripts/`)

| File | Purpose |
|------|---------|
| `setup.sh` | System installation and setup |
| `heartbeat.sh` | Agent heartbeat script |
| `health-check.sh` | System health diagnostics |
| `agent-message.sh` | Send message between agents |
| `quick-task.sh` | Quick task creation helper |
| `crontab.txt` | Cron job configuration |

## Examples Directory (`examples/`)

| File | Purpose |
|------|---------|
| `blog-post-workflow.md` | Content creation example |
| `feature-request-workflow.md` | Product feature example |
| `competitive-analysis-workflow.md` | Research example |

## Documentation (`docs/`)

| File | Purpose |
|------|---------|
| `architecture.md` | System architecture diagram |
| `api-reference.md` | CLI command reference |
| `troubleshooting.md` | Common issues and solutions |
| `task-templates.md` | Reusable task templates |

## Runtime Directories (Created at runtime)

| Directory | Purpose |
|-----------|---------|
| `messages/` | Inter-agent message files |
| `logs/` | Application logs |
| `data/` | SQLite database |

## Session Keys Reference

| Agent | Session Key |
|-------|-------------|
| Jarvis | `agent:main:main` |
| Shuri | `agent:product-analyst:main` |
| Fury | `agent:customer-researcher:main` |
| Vision | `agent:seo-analyst:main` |
| Loki | `agent:content-writer:main` |

## Quick Commands

```bash
# Setup
./scripts/setup.sh

# Health check
./scripts/health-check.sh

# Create task
./scripts/quick-task.sh "Title" jarvis high

# Send message
./scripts/agent-message.sh jarvis fury "Hello!"

# Mission Control CLI
cd mission-control
npm run dev -- task list
npm run dev -- dashboard
npm run dev -- standup generate
```
