# MEMORY.md - Long-Term Knowledge

*Curated memories and learnings for the multi-agent system.*

## Agent Strengths

### Jarvis
- Excellent at task prioritization
- Good at mediating disagreements
- Sometimes over-delegates simple tasks

### Shuri
- Finds edge cases others miss
- Direct communication style (not rude, just efficient)
- Takes longer but catches issues early

### Fury
- Thorough research with sources
- Good at finding unexpected insights
- Needs deadlines or will research forever

### Vision
- Data-driven recommendations
- Strong competitive analysis
- Sometimes sacrifices readability for SEO

### Loki
- Consistent voice across content
- Accepts feedback well
- Needs clear briefs to avoid scope creep

## Successful Patterns

### Task Assignment
- Always include clear deliverable description
- Set realistic deadlines (account for review cycles)
- Assign secondary reviewer for critical tasks

### Communication
- @mentions for urgent items
- Comments for context
- Daily standups for async alignment

### Content Workflow
1. Research → 2. Analysis → 3. SEO → 4. Writing → 5. Review
Average time: 3-5 days for major content

## Things That Didn't Work

### ❌ Parallel Everything
Tried having all agents work simultaneously. Result: conflicts, rework, confusion.

### ❌ Vague Briefs
"Write something about AI" → Poor results every time.

### ❌ No Review Steps
Skipped reviews to save time → Quality issues, rework.

### ❌ Ignoring Time Zones
Scheduled heartbeats during low-activity hours. Staggered schedule works better.

## Process Improvements

### Implemented
- Staggered heartbeats (reduced system load)
- @mention notification daemon
- Task templates for common work types
- Daily standup generation

### Under Consideration
- Agent skill matrix for better routing
- Automated quality scoring
- Predictive deadline estimation

## Tool Preferences

| Task Type | Preferred Tool |
|-----------|---------------|
| Research | web_search |
| Deep reading | web_fetch |
| Code | read/edit/write |
| Task mgmt | mc CLI |
| Urgent | @mention |

## Escalation Rules

Escalate to human when:
- Budget decisions needed
- Conflicting strategic direction
- External commitments required
- Legal/compliance questions
- Agent deadlock >24 hours

## Quality Benchmarks

### Content
- Blog posts: 3,000+ words, <5% passive voice
- Research: 3+ sources per claim
- SEO: Top 3 target keywords in first 100 words

### Code
- All scripts have --help
- Error handling for all I/O
- Logs to consistent location

### Analysis
- Edge cases documented
- Alternatives considered
- Recommendation with rationale

## Common Issues

### Database Locked
- Solution: Use WAL mode (already enabled)
- Prevention: Don't run long queries during heartbeats

### Notification Missed
- Usually file watcher issue
- Restart daemon: `npm run daemon`

### Agent Conflict
- Most common: Vision vs Loki (SEO vs readability)
- Resolution: A/B test or human decides

## Useful Commands

```bash
# Quick task status
mc task list --status in_progress,blocked

# Agent workload
mc task list --assignee jarvis

# Urgent items
mc task list --priority urgent

# Today's standup
mc standup generate
```

## Contact Points

| Issue | Contact |
|-------|---------|
| System down | @Jarvis + human |
| Task stuck | @Jarvis |
| Research question | @Fury |
| Content review | @Shuri |
| SEO emergency | @Vision |
| Writing help | @Loki |

## Retrospectives

### Sprint 1: System Setup
- ✅ All agents configured
- ✅ Mission Control functional
- ⚠️ Heartbeat timing needed adjustment
- Next: Test full workflow

---

*Last updated: 2025-02-03 by @Jarvis*
