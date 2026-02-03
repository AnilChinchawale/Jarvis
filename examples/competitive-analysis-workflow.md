# Example Workflow: Competitive Analysis

This example shows @Fury conducting deep competitive research.

## Starting Point

@Jarvis: "@Fury, we need to understand the competitive landscape for 
AI meeting assistants. Otter.ai, Fireflies, and Grain are key players."

## Workflow

### Step 1: Task Created

```bash
mc task create \
  --title "Competitive analysis: AI meeting assistants" \
  --assignee fury \
  --priority high \
  --due 2025-02-05 \
  --tags "research,competitive,market"
```

### Step 2: @Fury Research Execution

@Fury conducts systematic research:

```
**Competitive Analysis: AI Meeting Assistants**
*Research period: Feb 3-5, 2025*

## Market Overview

**Market Size:**
- AI meeting assistant market: $2.8B (2024) [Source: Grand View Research]
- Growth rate: 23.4% CAGR through 2030
- Key drivers: Remote work, meeting fatigue, compliance requirements

## Competitor Profiles

### 1. Otter.ai
**Founded:** 2016  
**Funding:** $63M (Series B, 2021) [Source: Crunchbase]  
**Users:** 10M+ (claimed)

**Strengths:**
- Early market entrant
- Strong free tier (300 min/month)
- Good speaker identification
- Integrations: Zoom, Google Meet, Teams

**Weaknesses:**
- Transcription accuracy ~85% (user reports)
- Limited action item extraction
- No video clip creation
- Pricing jumped 2x in 2023 (user complaints)

**Pricing:**
- Free: 300 min/month
- Pro: $10/user/month (1,200 min)
- Business: $20/user/month (unlimited)

**User Sentiment:**
> "Great for basic transcription, but misses action items" — G2 Review, 4/5
> "Price hike made me look elsewhere" — Reddit r/productivity

---

### 2. Fireflies.ai
**Founded:** 2016  
**Funding:** $19M (Series A, 2021) [Source: Crunchbase]  
**Users:** Not disclosed

**Strengths:**
- CRM integrations (Salesforce, HubSpot)
- Topic tracking and keyword alerts
- Video recording + transcription
- Conversation intelligence analytics

**Weaknesses:**
- Steeper learning curve
- UI/UX criticized as cluttered
- Limited free tier
- Accuracy varies by accent

**Pricing:**
- Free: 800 min/storage (limited)
- Pro: $10/user/month
- Business: $19/user/month
- Enterprise: Custom

**User Sentiment:**
> "Powerful but overwhelming for small teams" — Capterra Review
> "Sales team loves the CRM sync" — G2 Review, 4.5/5

---

### 3. Grain
**Founded:** 2018  
**Funding:** $22M (Series A, 2022) [Source: Crunchbase]  
**Users:** Not disclosed

**Strengths:**
- Video clip creation (unique differentiator)
- Storytelling/UX focus
- Great for customer research interviews
- Easy sharing (like Loom for meetings)

**Weaknesses:**
- Narrower use case (research-focused)
- Limited transcription features
- No real-time transcription
- Smaller integration ecosystem

**Pricing:**
- Free: 20 meetings (limited)
- Business: $15/user/month
- Enterprise: Custom

**User Sentiment:**
> "Game changer for sharing customer insights" — PM on Twitter
> "Wish it had real-time like Otter" — User interview

---

## Feature Comparison Matrix

| Feature | Otter.ai | Fireflies | Grain |
|---------|----------|-----------|-------|
| Real-time transcription | ✅ | ✅ | ❌ |
| Video recording | ❌ | ✅ | ✅ |
| Clip creation | ❌ | ❌ | ✅ |
| CRM integration | Basic | Advanced | None |
| Action items | Basic | Advanced | None |
| Speaker ID | ✅ | ✅ | ✅ |
| Free tier generous | ✅ | ⚠️ | ❌ |
| Mobile app | ✅ | ✅ | ❌ |

## Market Gaps Identified

1. **Real-time + Video + Clips**: No one does all three well
2. **Affordable team plan**: $10-15/user creates friction for startups
3. **Non-English support**: All three struggle with accents
4. **Privacy-first positioning**: Opportunity for EU/German market

## Pricing Analysis

```
Price/User/Month:
┌─────────────────────────────────────────┐
│ Otter Pro      ████████████ $10        │
│ Fireflies Pro  ████████████ $10        │
│ Grain Business █████████████████ $15   │
│ Otter Business ████████████████████ $20│
│ Fireflies Bus  ████████████████████ $19│
└─────────────────────────────────────────┘
```

All competitors converged on $10-20/user/month for paid tiers.

## Strategic Implications

### For Our Product:

**Opportunities:**
- Video clips + real-time (hybrid approach)
- Aggressive pricing ($8-12 range)
- Privacy-first messaging
- Better non-English support

**Threats:**
- Otter's brand recognition
- Fireflies' enterprise traction
- Well-funded incumbents can outspend

**Recommendations:**
1. Differentiate on video+real-time combo
2. Target mid-market ($8/user price point)
3. Build in public (content marketing)
4. Focus on product-led growth

## Sources

1. Grand View Research - AI Meeting Assistant Market Report 2024
2. Crunchbase - Funding data (Feb 2025)
3. G2 Reviews - Aggregated from 500+ reviews
4. Reddit r/productivity, r/sales - User discussions
5. Twitter/X - PM community sentiment
6. Company pricing pages (accessed Feb 3, 2025)

---

*Research by @Fury | Quality check by @Shuri*
```

### Step 3: Review & Action

@Shuri reviews:
```
Review: Competitive Analysis

✅ Quality Check:
- Multiple sources cited ✓
- Quantitative data included ✓
- User sentiment captured ✓
- Pricing current ✓

🔍 Questions:
- Any data on churn/retention rates?
- Security certifications compared?

💡 Suggestion:
- Add "Switching costs" analysis
- Consider NPS scores if available
```

@Jarvis action:
```
Excellent work @Fury. Key insights:
- Price point opportunity at $8-12
- Video+real-time combo is our differentiator
- Privacy angle for EU market

Next steps:
- @Vision: SEO analysis on "ai meeting assistant" keywords
- Product team: Review feature comparison for roadmap
- Sales: Position against Fireflies for enterprise

Marking complete.
```

```bash
mc task comment TASK-XXX --from jarvis --message "Analysis complete. Action items assigned. Great work @fury!"
mc task update TASK-XXX --status done
```

## Research Methodology

@Fury's approach:
1. **Secondary research**: Market reports, funding data
2. **User reviews**: G2, Capterra, Reddit sentiment
3. **Pricing analysis**: Current plans, historical changes
4. **Feature matrix**: Direct comparison
5. **Gap analysis**: What's missing in market

## Output Quality

- **Sources**: 6 primary sources
- **Data points**: 15+ quantitative metrics
- **User quotes**: 6 direct quotes with attribution
- **Decision-ready**: Clear recommendations

## Time Investment

- Research: 6 hours
- Analysis: 3 hours
- Review: 1 hour
- **Total: 10 hours**
