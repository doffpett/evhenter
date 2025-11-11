# Technical Decisions: evHenter

**Date**: 2025-11-11
**Status**: Approved
**Stakeholder**: @doffpett

## Overview

This document captures key technical decisions made for the evHenter project, answering the open questions from the implementation plan.

---

## Phase 0: Immediate Decisions ✅

### 1. Database Provider
**Decision**: ✅ **Vercel Postgres**

**Rationale**:
- Seamless integration with Vercel hosting platform
- Managed PostgreSQL with automatic backups
- Connection pooling built-in (pgbouncer)
- Cost-effective for startup phase
- Same dashboard for hosting + database

**Implementation**:
- Use `POSTGRES_URL` environment variable
- Connection via `pg` library in Node.js
- Migrations via simple SQL files

---

### 2. Authentication Method
**Decision**: ✅ **Email/Password + Vercel Auth (OAuth)**

**Rationale**:
- **Email/Password**: Core authentication method (JWT-based)
  - Full control over user data
  - Works for all users
  - Simpler initial implementation
- **Vercel Auth (OAuth)**: Optional social login
  - Vercel's built-in OAuth support
  - Easy integration with Google, GitHub
  - Reduces friction for social users
  - Can be added progressively

**Implementation**:
- Phase 2: Email/password with JWT (jose library)
- Phase 2.5 (optional): Add Vercel Auth for OAuth providers
- Session management: httpOnly cookies + JWT tokens
- Password requirements: Min 8 characters, bcryptjs hashing

**OAuth Providers to Consider** (Phase 2.5):
- Google (most users have Gmail)
- GitHub (developers/tech audience)

---

### 3. Domain Name
**Decision**: ✅ **evHenter.ai**

**Implications**:
- Production URL: `https://evhenter.ai`
- API Base: `https://evhenter.ai/api`
- Staging URL: `https://staging.evhenter.ai` or Vercel preview URLs
- Email domain: `no-reply@evhenter.ai` (if sending emails)

**DNS Configuration Required**:
- A/CNAME records pointing to Vercel
- SSL certificate (auto-managed by Vercel)

**Branding**:
- Logo should incorporate .ai domain
- Meta tags updated with evhenter.ai
- Open Graph tags for social sharing

---

## Phase 1: Development Decisions

### 4. CSS Approach
**Decision**: ✅ **Custom CSS with CSS Variables**

**Rationale**:
- Aligns with vanilla JavaScript requirement
- Full control over styling
- Lightweight (no framework overhead)
- CSS Variables for theming consistency
- Modern CSS features (Grid, Flexbox, Container Queries)

**Implementation**:
- `public/css/styles.css` - Global styles with CSS variables
- `public/css/components.css` - Component-specific styles
- `public/css/responsive.css` - Media queries
- Mobile-first approach

**CSS Variables** (evHenter theme):
```css
:root {
  --color-primary: #6366f1;      /* Indigo */
  --color-secondary: #8b5cf6;    /* Purple */
  --color-accent: #ec4899;       /* Pink */
  --color-success: #10b981;      /* Green */
  --color-warning: #f59e0b;      /* Amber */
  --color-error: #ef4444;        /* Red */
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
}
```

---

### 5. Date Picker
**Decision**: ✅ **Native HTML5 Date Inputs**

**Rationale**:
- Modern browsers support `<input type="date">`
- Native mobile date pickers (better UX)
- No additional library needed
- Accessible by default
- Can enhance with custom styling

**Implementation**:
- Use `<input type="date">` for single dates
- Two separate inputs for date ranges (start/end)
- Add custom styles for consistency
- Fallback: Text input with pattern validation (rare)

---

### 6. Image Placeholders
**Decision**: ✅ **Custom Illustrated Placeholders**

**Rationale**:
- Brand consistency with evHenter theme
- Professional appearance
- Event type-specific placeholders (conference, concert, etc.)
- Differentiation from generic gray boxes

**Implementation**:
- SVG placeholders in `public/images/placeholders/`
- One placeholder per event type (8 types)
- Colored with evHenter theme colors
- Lazy load with blur-up effect
- Design in Phase 1, create in Phase 5 (or outsource)

**Temporary Solution (Phase 1)**:
- Solid color backgrounds with event type icon
- Generate programmatically from CSS

---

## Phase 3: AI Integration Decisions

### 7. OpenAI Model for Parsing
**Decision**: ✅ **GPT-4 Turbo** (with fallback to GPT-3.5)

**Rationale**:
- GPT-4 Turbo: Best balance of speed, cost, and quality
- ~50% cheaper than GPT-4
- Faster response times (<10s typical)
- Better instruction following for structured extraction
- Fallback to GPT-3.5 if cost becomes issue

**Cost Estimate**:
- GPT-4 Turbo: ~$0.01-0.03 per event parse
- 1000 events/month = $10-30/month parsing cost

**Implementation**:
- Use GPT-4 Turbo (`gpt-4-turbo-preview`) initially
- Monitor costs via OpenAI dashboard
- Switch to GPT-3.5-turbo if accuracy >70% and cost critical

---

### 8. DALL-E Version
**Decision**: ✅ **DALL-E 3** (quality over cost)

**Rationale**:
- Significant quality improvement over DALL-E 2
- Better prompt adherence (brand consistency)
- Higher resolution (1024x1024+)
- Cost: $0.040-0.080 per image (acceptable for UGC platform)
- Not all events need AI images (user uploads available)

**Cost Estimate**:
- DALL-E 3: ~$0.04 per image (1024x1024 standard)
- If 30% of events need AI images: 300 images/month = $12/month

**Total AI Cost Estimate** (1000 events/month):
- Parsing: $10-30/month
- Images: $12/month (30% need generation)
- **Total**: ~$25-50/month

**Implementation**:
- Generate images on-demand (not all events)
- Cache similar prompts (event type + general description)
- Allow regeneration (limit 3x per event)
- Store generation prompt with image for reuse

---

### 9. Background Jobs
**Decision**: ✅ **In-Memory Queue** (Phase 3) → **BullMQ + Vercel KV** (Phase 5+)

**Rationale**:
- **Phase 3 (MVP)**: Simple in-memory job queue
  - No additional infrastructure needed
  - Good enough for low volume (<100 jobs/day)
  - Vercel serverless can handle async operations
  - Jobs lost on cold start (acceptable for MVP)

- **Phase 5 (Scale)**: BullMQ with Vercel KV (Redis)
  - Persistent job queue
  - Retry logic and failure handling
  - Job prioritization
  - Scales with traffic

**Implementation (Phase 3)**:
```javascript
// Simple in-memory queue
const jobQueue = [];
async function processJobs() {
  while (jobQueue.length > 0) {
    const job = jobQueue.shift();
    await executeJob(job);
  }
}
```

**Migration Path (Phase 5)**:
- Add Vercel KV (Redis) to project
- Install BullMQ library
- Migrate job processing to BullMQ
- Set up job monitoring dashboard

---

## Phase 4: Community Features Decisions

### 10. Moderation Start
**Decision**: ✅ **Moderator-Only Approval** (Phase 2-3) → **Community Approval** (Phase 4)

**Rationale**:
- **Phase 2-3**: Start with moderator approval only
  - Faster event approval (you + team)
  - Quality control during beta
  - Build initial event database
  - No complex reputation system needed yet

- **Phase 4**: Enable community approval
  - Platform has active user base
  - Reputation scores established
  - Moderator workload scales

**Implementation**:
- Phase 2: Status field: `pending` → moderator approves → `approved`
- Phase 3: Add moderator dashboard
- Phase 4: Add reputation system and community voting
- Use feature flag: `ENABLE_COMMUNITY_APPROVAL=false` initially

---

### 11. Reputation Algorithm
**Decision**: ✅ **Simple Count** (Phase 4) → **Weighted by Quality** (Phase 5+)

**Rationale**:
- **Phase 4 (MVP)**: Simple point system
  - +10 points per approved event submission
  - -5 points per rejected event submission
  - +1 point per helpful approval vote
  - Simple to understand and implement

- **Phase 5 (Advanced)**: Quality-weighted reputation
  - Event popularity affects points
  - Approval accuracy (voted with majority)
  - Time-decay for old contributions

**Initial Reputation Levels**:
- 0-49: New user (cannot approve events)
- 50-99: Trusted user (can approve events)
- 100-249: Veteran user (badge)
- 250+: Top contributor (badge, early access features)

**Implementation**:
```sql
-- Phase 4 schema
users {
  reputation_score INTEGER DEFAULT 0,
  events_submitted INTEGER DEFAULT 0,
  events_approved INTEGER DEFAULT 0,
  events_rejected INTEGER DEFAULT 0,
  approvals_given INTEGER DEFAULT 0
}
```

---

## Phase 5: Production Decisions

### 12. Analytics
**Decision**: ✅ **Plausible Analytics** (self-hosted or cloud)

**Rationale**:
- Privacy-friendly (GDPR compliant)
- Lightweight (<1KB script)
- No cookie banner needed
- Open-source option available
- Simple, actionable insights

**Alternative**: Vercel Analytics (if Plausible too complex)

**Implementation**:
- Add Plausible script to all pages
- Track: Page views, event clicks, filter usage, submissions
- Privacy-first: No personal data tracking

---

### 13. Error Tracking
**Decision**: ✅ **Sentry** (generous free tier)

**Rationale**:
- Industry standard
- Great error grouping and insights
- Source map support
- Performance monitoring included
- Free tier: 5K errors/month

**Implementation**:
- Add Sentry SDK to frontend + backend
- Environment: `production` only
- Sample rate: 100% errors, 10% performance
- Alerts: Email + Slack (optional)

---

## Summary of Decisions

| Question | Decision | Status |
|----------|----------|--------|
| Database | Vercel Postgres | ✅ Approved |
| Authentication | Email/Password + Vercel Auth (OAuth) | ✅ Approved |
| Domain | evHenter.ai | ✅ Approved |
| CSS Framework | Custom CSS with Variables | ✅ Approved |
| Date Picker | Native HTML5 | ✅ Approved |
| Image Placeholders | Custom Illustrated | ✅ Approved |
| OpenAI Parsing | GPT-4 Turbo | ✅ Approved |
| Image Generation | DALL-E 3 | ✅ Approved |
| Background Jobs | In-memory (MVP) → BullMQ (Scale) | ✅ Approved |
| Initial Moderation | Moderator-only | ✅ Approved |
| Reputation System | Simple Count (Phase 4) | ✅ Approved |
| Analytics | Plausible | ✅ Approved |
| Error Tracking | Sentry | ✅ Approved |

---

## Cost Projections (Monthly)

### Infrastructure
- Vercel Hosting: $0-20 (Hobby tier free, Pro $20 if needed)
- Vercel Postgres: $0-24 (Hobby tier includes 256MB free)
- Vercel Blob Storage: ~$5 (first 1GB free)

### AI Services
- OpenAI API: $25-50 (1000 events/month)
  - Parsing: $10-30
  - Images: $12-20

### Monitoring & Analytics
- Sentry: $0 (free tier)
- Plausible: $0 (self-hosted) or $9 (cloud)

**Total Estimated**: $30-100/month depending on scale

---

## Next Steps

1. ✅ Decisions documented
2. Update plan.md with decisions
3. Update tasks.md with specific implementations
4. Begin Phase 0 implementation with:
   - Vercel Postgres setup
   - Domain configuration (evHenter.ai)
   - Email/password auth implementation
5. Create Vercel project and link to GitHub

---

**Approved by**: @doffpett
**Date**: 2025-11-11
**Version**: 1.0.0
