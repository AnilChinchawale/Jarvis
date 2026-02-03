# Example Workflow: Product Feature Request

This example shows how the team handles a new product feature request.

## Starting Point

Human: "We need to add dark mode to our app. Users have been asking for it."

## Step-by-Step Execution

### Step 1: @Jarvis Triage

@Jarvis creates tasks:

```bash
# Feature request task
mc task create \
  --title "Dark mode feature implementation" \
  --assignee jarvis \
  --priority high \
  --tags "feature,ui,accessibility"

# Research subtask
mc task create \
  --title "Research dark mode UX best practices" \
  --assignee fury \
  --priority high \
  --parent-id TASK-XXX

# Analysis subtask  
mc task create \
  --title "Analyze dark mode implementation requirements" \
  --assignee shuri \
  --priority high \
  --parent-id TASK-XXX
```

### Step 2: @Fury Research

```
**Research: Dark Mode UX Best Practices**

📊 Key Findings:
- 82% of users prefer dark mode at night [Source: Android Authority, 2023]
- System-wide preference detection is expected (iOS 13+, Android 10+)
- Pure black (#000000) causes eye strain; recommended: #121212

💬 User Quotes:
> "Dark mode isn't just preference, it's accessibility for my light sensitivity" 
  — HackerNews comment, 245 upvotes
> "Apps without dark mode feel dated" — Twitter/X poll, 12K votes

📈 Implementation Trends:
- CSS custom properties (variables) most common approach
- Toggle + system preference (respects user choice)
- Images need brightness adjustment or separate variants
- Syntax highlighting themes need dark variants

⚠️ Edge Cases Found:
- Print stylesheets often break with dark mode
- E-ink devices may not support
- OLED burn-in with static UI elements
- Contrast ratios must still meet WCAG AA

🎯 Recommendations:
- Use CSS media query prefers-color-scheme
- Provide manual override toggle
- Test with actual users who need dark mode
- Consider "dim" mode as middle ground
```

### Step 3: @Shuri Analysis

```
**Analysis: Dark Mode Implementation**

✅ Strengths:
- Clear user demand
- Modern accessibility standard
- Relatively well-understood problem space

⚠️ Concerns:
1. **Scope creep**: "Dark mode" often leads to "theme system"
2. **Testing matrix**: Light/Dark × Browser × Device × User override
3. **Third-party components**: Charts, maps, embeds may not support
4. **Image assets**: Need review of all images for visibility

🔍 Edge Cases:
1. User on light OS but wants dark app (or vice versa)
2. Switching mid-session (transition animation?)
3. PDF generation (always light?)
4. Email templates (can't control recipient's mode)
5. Shared screenshots (what mode were they in?)
6. Color-blind users in dark mode

💡 Implementation Suggestions:
- Phase 1: Basic dark palette, CSS variables
- Phase 2: Manual toggle with persistence
- Phase 3: Advanced theming system (if needed)
- Define: 6 core colors map to semantic names
- Testing: Automated visual regression for both modes
```

### Step 4: @Jarvis Planning

After receiving research and analysis:

```
[Plan] Dark Mode Implementation

Based on @Fury's research and @Shuri's analysis:

Phase 1 (This Sprint):
- Define color system (6 semantic colors)
- CSS custom properties
- System preference detection
- Basic dark palette (#121212 base)

Phase 2 (Next Sprint):
- Manual toggle with persistence
- Transition animations
- Image brightness adjustment

Out of Scope:
- Full theming system (can revisit if needed)
- Per-component color customization

Risks:
- Image audit may reveal many assets need work
- Third-party embeds won't adapt

Assigned:
- @Loki: Write implementation spec
- @Vision: SEO (docs need dark mode keywords)
- Dev team: Implementation (external)
```

### Step 5: @Loki Documentation

@Loki writes technical specification:

```markdown
# Dark Mode Implementation Spec

## Color System

We define 6 semantic colors:

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| --color-bg | #FFFFFF | #121212 | Page background |
| --color-surface | #F5F5F5 | #1E1E1E | Cards, panels |
| --color-text | #1A1A1A | #E0E0E0 | Primary text |
| --color-text-secondary | #666666 | #A0A0A0 | Secondary text |
| --color-border | #E0E0E0 | #333333 | Borders, dividers |
| --color-accent | #0066CC | #4D9FFF | Links, buttons |

## CSS Implementation

```css
:root {
  /* Default to light */
  --color-bg: #FFFFFF;
  --color-surface: #F5F5F5;
  /* ... etc */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #121212;
    --color-surface: #1E1E1E;
    /* ... etc */
  }
}

/* Manual override classes */
.theme-light { /* light values */ }
.theme-dark { /* dark values */ }
```

## JavaScript Detection

```javascript
// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Listen for changes
prefersDark.addEventListener('change', (e) => {
  if (!userHasOverridden) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});
```

## Testing Checklist

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] System preference respected
- [ ] Manual toggle works
- [ ] Preference persists across sessions
- [ ] All interactive states visible
- [ ] Images visible in both modes
- [ ] Charts and graphs readable
- [ ] WCAG AA contrast ratios met
```

### Step 6: @Shuri Review

```
Review of Dark Mode Spec

✅ Approved with notes:

- Color contrast ratios verified (all pass WCAG AA)
- Consider adding --color-error and --color-success (forms need them)
- Add prefers-reduced-motion for theme transitions
- Test with Windows High Contrast mode

🔍 Additional Edge Cases:
- Print styles should force light mode (save ink)
- Screenshot tool should capture current mode
- Email preview in app needs iframe isolation
```

### Step 7: Completion

@Jarvis marks complete:

```bash
mc task comment TASK-XXX --from jarvis --message "Spec approved. Handing to dev team. @shuri please review PR when ready."
mc task update TASK-XXX --status done
```

## Timeline

| Phase | Duration | Owner |
|-------|----------|-------|
| Research | 4 hours | @Fury |
| Analysis | 3 hours | @Shuri |
| Planning | 2 hours | @Jarvis |
| Documentation | 4 hours | @Loki |
| Review | 2 hours | @Shuri |
| **Total** | **~15 hours** | Team |

## Key Decisions

1. **CSS Variables**: Chosen over CSS-in-JS for performance
2. **6 Color Tokens**: Balance of flexibility vs simplicity
3. **Phase Approach**: Prevents scope creep
4. **#121212 base**: Not pure black (OLED burn-in prevention)

## Risks Mitigated

- Scope creep: Phased approach with clear boundaries
- Accessibility: WCAG AA compliance required
- Technical debt: Semantic tokens prevent hardcoded colors
