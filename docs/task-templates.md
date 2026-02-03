# Task Templates

Quick-start templates for common task types.

## Research Task

```bash
mc task create \
  --title "Research: [TOPIC]" \
  --assignee fury \
  --priority normal \
  --description "Research needed on [TOPIC]. Focus areas:
- Market size and growth
- Key players and their positioning
- Customer pain points
- Recent trends

Deliverable: Research report with sources."
```

## Product Analysis

```bash
mc task create \
  --title "Analyze: [FEATURE/PRODUCT]" \
  --assignee shuri \
  --priority high \
  --description "Analyze [FEATURE] for implementation:

Checklist:
- [ ] User story clarity
- [ ] Edge cases identified
- [ ] UX concerns documented
- [ ] Accessibility review
- [ ] Security implications
- [ ] Performance impact
- [ ] Dependency analysis

Deliverable: Analysis document with go/no-go recommendation."
```

## SEO Brief

```bash
mc task create \
  --title "SEO: [CONTENT TOPIC]" \
  --assignee vision \
  --priority normal \
  --description "Create SEO strategy for [CONTENT]:

Requirements:
- Primary keyword identification
- Secondary keywords (10-15)
- Search intent analysis
- Competitor content review
- Content structure recommendations
- Internal linking suggestions

Deliverable: SEO brief document."
```

## Content Writing

```bash
mc task create \
  --title "Write: [CONTENT TYPE] - [TOPIC]" \
  --assignee loki \
  --priority normal \
  --description "Create [CONTENT TYPE] about [TOPIC]:

Brief:
- Target audience: [AUDIENCE]
- Tone: [TONE]
- Length: [WORD COUNT]
- Key points to cover: [LIST]
- SEO brief: [ATTACH/REFERENCE]

Deliverable: Draft content in markdown."
```

## Bug Fix / Issue

```bash
mc task create \
  --title "Fix: [ISSUE DESCRIPTION]" \
  --assignee [AGENT] \
  --priority urgent \
  --description "Issue: [DESCRIPTION]

Impact: [USER/SCOPE]
Steps to reproduce:
1. 
2. 

Expected: 
Actual: 

Reference: [LOGS/Screenshots]"
```

## Content Review

```bash
mc task create \
  --title "Review: [CONTENT TITLE]" \
  --assignee [shuri|vision] \
  --priority high \
  --description "Review [CONTENT] for:

- [ ] Accuracy
- [ ] Clarity
- [ ] [Shuri: Edge cases covered]
- [ ] [Vision: SEO optimization]
- [ ] Tone consistency
- [ ] Grammar/style

Original task: [LINK]

Deliverable: Review comments with approval or revision requests."
```

## Documentation

```bash
mc task create \
  --title "Document: [TOPIC]" \
  --assignee loki \
  --priority low \
  --description "Create documentation for [TOPIC]:

Type: [API/User guide/Process]
Audience: [Technical/Non-technical]
Sections needed:
- 
- 
- 

Reference materials: [LINKS]"
```

## Coordination / Meta

```bash
mc task create \
  --title "Coordinate: [INITIATIVE]" \
  --assignee jarvis \
  --priority high \
  --description "Coordinate [INITIATIVE] across team:

Scope: 
Timeline: 
Key stakeholders: 

Subtasks needed:
- [ ] Research (@fury)
- [ ] Analysis (@shuri)
- [ ] SEO (@vision)
- [ ] Content (@loki)

Check in points: [DATES]"
```
