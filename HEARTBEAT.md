# HEARTBEAT.md - Wake Procedure

This file defines what every agent does when they wake up from a heartbeat.

## Universal Wake Steps

All agents MUST do these steps on every heartbeat:

### 1. Read Identity
- Read your `SOUL.md` - remember who you are
- Read `AGENTS.md` - understand the system

### 2. Check Mission Control
```bash
# Check for your assigned tasks
mc task list --assignee YOUR_NAME --status assigned,in_progress

# Check for urgent tasks
mc task list --priority urgent
```

### 3. Check Notifications
```bash
# Check for @mentions
mc notify list --unread
```

### 4. Review Working Memory
- Read `memory/WORKING.md` for current context
- Read `memory/YYYY-MM-DD.md` for today's activity

### 5. Process Urgent Items

If you have:
- **Urgent tasks** → Work on them immediately
- **@mentions** → Respond to them
- **Blocked tasks** → Escalate to @Jarvis
- **Deadlines <2h** → Prioritize these

### 6. Routine Check (if nothing urgent)

```
Last heartbeat: [timestamp]
Status: HEARTBEAT_OK
```

## Agent-Specific Wake Tasks

### Jarvis (Squad Lead)
- [ ] Review all in-progress tasks
- [ ] Check for blocked items needing escalation
- [ ] Review agent availability
- [ ] Generate standup if morning
- [ ] Check system health

### Shuri (Product Analyst)
- [ ] Check for product reviews requested
- [ ] Review open PRs/features
- [ ] Check for edge case reports to write
- [ ] Follow up on previous concerns

### Fury (Customer Researcher)
- [ ] Check for research requests
- [ ] Review active research topics
- [ ] Update research docs if needed
- [ ] Follow up on pending sources

### Vision (SEO Analyst)
- [ ] Check for SEO analysis requests
- [ ] Review content drafts for optimization
- [ ] Update keyword tracking
- [ ] Check search trends

### Loki (Content Writer)
- [ ] Check for writing assignments
- [ ] Review drafts needing editing
- [ ] Check content calendar
- [ ] Follow up on feedback

## Heartbeat State Tracking

Agents track their last checks in `memory/heartbeat-state.json`:

```json
{
  "jarvis": {
    "lastHeartbeat": "2025-02-03T08:00:00Z",
    "status": "HEARTBEAT_OK",
    "tasksChecked": 5,
    "notificationsChecked": 2
  },
  "shuri": {
    "lastHeartbeat": "2025-02-03T08:02:00Z",
    "status": "HEARTBEAT_OK"
  }
}
```

## Quick Response Guide

| Situation | Action |
|-----------|--------|
| Urgent @mention | Respond immediately |
| Assigned urgent task | Start work, update status |
| Deadline <2h | Prioritize, notify if at risk |
| Task blocked | Escalate to @Jarvis |
| Nothing urgent | Reply `HEARTBEAT_OK` |
| System error | Notify human + @Jarvis |

## Remember

- **Heartbeats are for checks, not conversations**
- If nothing needs attention: `HEARTBEAT_OK`
- Don't wake other agents unnecessarily
- Document your actions in daily notes
- Respect quiet hours (23:00-08:00)
