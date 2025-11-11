# Implementation Plan: evHenter - Community Event Discovery Platform

**Branch**: `002-event-management-system` | **Date**: 2025-11-11 | **Spec**: [spec-event-management.md](../../.specify/memory/spec-event-management.md)

**Input**: Feature specification from `.specify/memory/spec-event-management.md`

## Summary

**Primary Requirement**: Build a community-driven event discovery platform where users can browse, filter, and discover local events. Users can contribute events manually or via AI-powered URL parsing. The platform features community-based approval system, custom saved filters, and AI-generated event cover images using OpenAI.

**Technical Approach**: Vanilla JavaScript web application deployed on Vercel with serverless API functions. PostgreSQL database hosted on Vercel. Lightweight, progressive web app architecture with mobile-first responsive design. Server-side rendering for SEO and performance. OpenAI integration for event parsing (GPT-4) and image generation (DALL-E 3).

**Key Constraint**: Minimize framework dependencies - use vanilla HTML/CSS/JavaScript where possible, only introduce libraries when strictly necessary for functionality (auth, database client, OpenAI SDK).

## Technical Context

**Language/Version**:
- Frontend: Vanilla JavaScript (ES6+), HTML5, CSS3
- Backend: Node.js 18+ (Vercel serverless functions)

**Primary Dependencies**:
- **Vercel Postgres** - Database (PostgreSQL compatible)
- **OpenAI SDK** (openai@4.x) - AI parsing and image generation
- **jose** - JWT token handling for authentication
- **bcryptjs** - Password hashing
- **pg** - PostgreSQL client for database operations
- **date-fns** (optional) - Date formatting utilities
- **Minimal CSS framework**: Custom CSS with CSS Grid/Flexbox (no Bootstrap/Tailwind initially)

**Storage**:
- PostgreSQL (Vercel Postgres) - User data, events, approvals, filters
- Vercel Blob Storage - User-uploaded and AI-generated images
- Session storage: JWT tokens (httpOnly cookies)

**Testing**:
- Frontend: Plain JavaScript unit tests with Node.js test runner
- Backend: Node.js test runner for API endpoints
- E2E: Playwright for critical user journeys
- Manual testing for AI integration accuracy

**Target Platform**:
- Web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Mobile responsive (iOS Safari 14+, Android Chrome 90+)
- Progressive Web App (PWA) capabilities for mobile home screen

**Project Type**: Web (frontend + backend serverless functions)

**Performance Goals**:
- First Contentful Paint (FCP) < 1.5s on 3G
- Time to Interactive (TTI) < 3s on 3G
- Lighthouse Score: 90+ (Performance, Accessibility, SEO)
- API response time: P95 < 500ms
- Filter application: < 300ms for 1000+ events

**Constraints**:
- Vanilla JavaScript - no React/Vue/Angular
- Mobile-first responsive design
- Works without JavaScript (progressive enhancement where possible)
- Offline capability for browsing cached events (PWA service worker)
- OpenAI API cost budget: < $0.10 per event (parsing + image generation)

**Scale/Scope**:
- Target: 500+ events within 3 months
- Expected traffic: 1000+ daily active users
- Database: ~10K events, ~5K users at scale
- 8 major user stories across 5 implementation phases

## Constitution Check

*Based on evHenter Constitution v1.0.0*

### ✅ Code Quality Standards
- **Type Safety**: Using JSDoc type annotations for vanilla JavaScript
- **Code Organization**: Clear module separation (services, models, utils)
- **Code Style**: ESLint with StandardJS or Airbnb config
- **Maximum file length**: 300 lines enforced

### ✅ Testing Standards
- **Minimum 80% coverage**: Unit tests for all business logic
- **TDD workflow**: Tests before implementation for critical paths
- **Test quality**: Arrange-Act-Assert pattern enforced

### ✅ User Experience Consistency
- **Mobile-first**: Progressive enhancement approach
- **Loading states**: Skeleton screens and loading indicators
- **Error handling**: Actionable error messages
- **Accessibility**: WCAG 2.1 AA compliance (semantic HTML, ARIA labels, keyboard nav)

### ✅ Performance Requirements
- **Bundle size**: < 200KB gzipped (initial load)
- **Images**: WebP with fallbacks, lazy loading
- **Caching**: Service worker for offline capability

### ✅ Security Standards
- **Authentication**: JWT with httpOnly cookies
- **Input validation**: Server-side validation for all inputs
- **Rate limiting**: 5 event submissions per hour per user
- **Content Security Policy (CSP)**: Strict CSP headers

### ⚠️ Exceptions & Justifications

| Exception | Justification | Alternative Rejected |
|-----------|--------------|---------------------|
| No TypeScript | User requirement for vanilla JS | TypeScript provides better safety but adds build complexity |
| Limited test coverage initially | MVP focus, will reach 80% by Phase 2 | Full coverage upfront delays user validation |
| Manual AI accuracy testing | No automated quality metrics for OpenAI responses | Would require expensive ML validation pipeline |

## Project Structure

### Documentation (this feature)

```text
specs/002-event-management/
├── plan.md                    # This file (implementation plan)
├── research.md                # Phase 0: Technology research and decisions
├── data-model.md              # Phase 1: Database schema and relationships
├── api-contracts.md           # Phase 1: API endpoint specifications
├── quickstart.md              # Phase 1: Development setup guide
└── tasks.md                   # Phase 2: Detailed task breakdown
```

### Source Code (repository root)

```text
evHenter/
├── api/                       # Vercel serverless functions
│   ├── events/
│   │   ├── index.js           # GET /api/events (list with filters)
│   │   ├── [id].js            # GET /api/events/:id (single event)
│   │   ├── create.js          # POST /api/events (create event)
│   │   ├── update.js          # PATCH /api/events/:id
│   │   └── parse-url.js       # POST /api/events/parse-url (OpenAI)
│   ├── auth/
│   │   ├── register.js        # POST /api/auth/register
│   │   ├── login.js           # POST /api/auth/login
│   │   ├── logout.js          # POST /api/auth/logout
│   │   └── me.js              # GET /api/auth/me
│   ├── approvals/
│   │   ├── approve.js         # POST /api/approvals/approve
│   │   └── reject.js          # POST /api/approvals/reject
│   ├── filters/
│   │   ├── index.js           # GET /api/filters (user's saved filters)
│   │   ├── create.js          # POST /api/filters
│   │   ├── update.js          # PATCH /api/filters/:id
│   │   └── delete.js          # DELETE /api/filters/:id
│   ├── images/
│   │   ├── generate.js        # POST /api/images/generate (DALL-E)
│   │   └── upload.js          # POST /api/images/upload (user upload)
│   └── metadata/
│       ├── locations.js       # GET /api/metadata/locations
│       └── types.js           # GET /api/metadata/types
│
├── public/                    # Static assets
│   ├── index.html             # Main entry point
│   ├── event-detail.html      # Event detail page template
│   ├── auth.html              # Login/Register page
│   ├── profile.html           # User profile page
│   ├── submit.html            # Event submission page
│   ├── moderation.html        # Moderation queue (moderators)
│   ├── css/
│   │   ├── styles.css         # Global styles
│   │   ├── components.css     # Reusable component styles
│   │   ├── layouts.css        # Layout utilities
│   │   └── responsive.css     # Media queries
│   ├── js/
│   │   ├── main.js            # Application entry point
│   │   ├── router.js          # Client-side routing (SPA)
│   │   ├── services/
│   │   │   ├── api.js         # API client wrapper
│   │   │   ├── auth.js        # Authentication service
│   │   │   ├── events.js      # Event service
│   │   │   ├── filters.js     # Filter service
│   │   │   └── openai.js      # OpenAI service wrapper
│   │   ├── components/
│   │   │   ├── event-card.js  # Event card component
│   │   │   ├── filter-panel.js # Filter panel component
│   │   │   ├── modal.js       # Reusable modal component
│   │   │   ├── toast.js       # Toast notification component
│   │   │   └── form-validator.js # Form validation utilities
│   │   ├── pages/
│   │   │   ├── home.js        # Main event list page logic
│   │   │   ├── event-detail.js # Event detail page logic
│   │   │   ├── auth-page.js   # Auth page logic
│   │   │   ├── profile.js     # Profile page logic
│   │   │   ├── submit.js      # Event submission logic
│   │   │   └── moderation.js  # Moderation queue logic
│   │   └── utils/
│   │       ├── date.js        # Date formatting utilities
│   │       ├── validation.js  # Input validation
│   │       ├── storage.js     # LocalStorage wrapper
│   │       └── dom.js         # DOM manipulation helpers
│   ├── images/
│   │   ├── logo.svg           # evHenter logo
│   │   ├── placeholders/      # Placeholder images
│   │   └── icons/             # Icon set
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker for offline
│   └── robots.txt             # SEO robots file
│
├── lib/                       # Shared backend utilities
│   ├── db/
│   │   ├── connection.js      # PostgreSQL connection pool
│   │   ├── schema.sql         # Database schema DDL
│   │   ├── migrations/        # Database migrations
│   │   └── queries.js         # Parameterized SQL queries
│   ├── middleware/
│   │   ├── auth.js            # JWT verification middleware
│   │   ├── validate.js        # Request validation middleware
│   │   ├── rate-limit.js      # Rate limiting middleware
│   │   └── error-handler.js   # Error handling middleware
│   ├── services/
│   │   ├── openai-service.js  # OpenAI API wrapper
│   │   ├── email-service.js   # Email sending (optional)
│   │   └── image-service.js   # Image upload/optimization
│   ├── models/
│   │   ├── event.js           # Event model with CRUD methods
│   │   ├── user.js            # User model
│   │   ├── approval.js        # Approval model
│   │   └── filter.js          # SavedFilter model
│   └── utils/
│       ├── jwt.js             # JWT token utilities
│       ├── hash.js            # Password hashing
│       ├── validators.js      # Input validation schemas
│       └── logger.js          # Logging utility
│
├── tests/
│   ├── unit/
│   │   ├── models/            # Model unit tests
│   │   ├── services/          # Service unit tests
│   │   └── utils/             # Utility unit tests
│   ├── integration/
│   │   ├── api/               # API endpoint tests
│   │   └── db/                # Database integration tests
│   ├── e2e/
│   │   ├── browse-events.spec.js     # User Story 1
│   │   ├── event-detail.spec.js      # User Story 2
│   │   ├── submit-event.spec.js      # User Story 3
│   │   ├── url-parsing.spec.js       # User Story 4
│   │   └── saved-filters.spec.js     # User Story 6
│   └── fixtures/              # Test data and mocks
│
├── .github/
│   └── workflows/
│       ├── ci.yml             # CI pipeline (tests, linting)
│       └── deploy.yml         # CD to Vercel
│
├── package.json               # Node.js dependencies
├── vercel.json                # Vercel configuration
├── .env.example               # Environment variables template
├── .env.local                 # Local environment (gitignored)
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
└── README.md                  # Project documentation
```

**Structure Decision**: Selected **Option 2 (Web application)** with modification for Vercel serverless architecture. Frontend is vanilla JavaScript in `public/` directory with static HTML pages. Backend is serverless functions in `api/` directory. Shared backend logic in `lib/`. This structure optimizes for Vercel deployment while maintaining clear separation of concerns.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Vanilla JS instead of framework | User requirement + lightweight architecture | React/Vue would provide better structure but violates constraint |
| Manual JSDoc types vs TypeScript | User requirement for vanilla JS | TypeScript would be safer but adds build step complexity |
| Service Worker for offline | PWA requirement for mobile experience | Server-side rendering only doesn't support offline browsing |
| Custom component system | No framework available in vanilla JS | Web Components API is less mature, template literals are simpler |

## Implementation Phases

### Phase 0: Research & Setup (Week 1)
**Deliverables**: `research.md`, `quickstart.md`, project scaffolding

**Activities**:
1. **Technology validation**
   - Verify Vercel serverless functions with vanilla JS
   - Test PostgreSQL connection from Vercel functions
   - Validate OpenAI SDK in serverless environment
   - Confirm Vercel Blob Storage for images

2. **Development environment setup**
   - Initialize Git repository on GitHub
   - Configure Vercel project and link to GitHub
   - Set up local PostgreSQL (Docker) for development
   - Create `.env.example` with required variables

3. **Project scaffolding**
   - Create folder structure per plan
   - Set up ESLint + Prettier configuration
   - Configure Vercel.json for routing and functions
   - Create basic package.json with minimal dependencies

4. **Database design**
   - Create `schema.sql` with all tables
   - Set up migration system (simple SQL files)
   - Seed script for development data
   - Document in `data-model.md`

5. **API contract definition**
   - Document all endpoints in `api-contracts.md`
   - Define request/response schemas
   - Error response formats
   - Authentication flow diagrams

**Output Files**:
- `specs/002-event-management/research.md` - Technology decisions and rationale
- `specs/002-event-management/data-model.md` - Database schema and ERD
- `specs/002-event-management/api-contracts.md` - API specifications
- `specs/002-event-management/quickstart.md` - Developer setup guide
- Basic project structure created

**Success Criteria**:
- [ ] Local development environment runs successfully
- [ ] Can deploy "Hello World" serverless function to Vercel
- [ ] Database connection established and tested
- [ ] OpenAI API test request succeeds
- [ ] All documentation complete and reviewed

---

### Phase 1: MVP Foundation - Browse & Filter Events (Weeks 2-3)
**User Stories**: P1 - Browse and Filter Events, View Event Details

**Activities**:

**Week 2: Backend API & Database**
1. **Database implementation**
   - Create `events`, `locations`, `event_types` tables
   - Implement connection pool in `lib/db/connection.js`
   - Write parameterized queries in `lib/db/queries.js`
   - Seed database with 50+ test events

2. **Events API**
   - `GET /api/events` - List with filtering (location, date, type)
   - `GET /api/events/:id` - Single event details
   - Implement query builder for dynamic filters
   - Add pagination (24 per page)
   - Add sorting (date, popularity)

3. **Metadata API**
   - `GET /api/metadata/locations` - Cities for dropdown
   - `GET /api/metadata/types` - Event types for filter

4. **Middleware**
   - Error handler middleware (`lib/middleware/error-handler.js`)
   - Request validation middleware (`lib/middleware/validate.js`)
   - Logging utility (`lib/utils/logger.js`)

**Week 3: Frontend UI**
1. **Main page layout** (`public/index.html`)
   - Header with logo and navigation
   - Filter panel (sidebar on desktop, modal on mobile)
   - Event grid (responsive CSS Grid)
   - Footer

2. **Event card component** (`public/js/components/event-card.js`)
   - Display title, date, location, type, image
   - Click handler to navigate to detail page
   - Lazy loading images
   - Skeleton loader

3. **Filter panel** (`public/js/components/filter-panel.js`)
   - Location dropdown (autocomplete)
   - Date range picker (native input type="date")
   - Event type checkboxes
   - Clear filters button
   - Active filter count badge

4. **Event detail page** (`public/event-detail.html`)
   - Full event information
   - Cover image (responsive)
   - "Visit Event Page" CTA button
   - Back button with filter preservation
   - Social sharing buttons

5. **API service layer** (`public/js/services/`)
   - `api.js` - Fetch wrapper with error handling
   - `events.js` - Event-specific API calls
   - Implement request caching (5 min)

6. **Routing** (`public/js/router.js`)
   - Client-side routing with History API
   - Route definitions for pages
   - Link interception for SPA navigation
   - Preserve filter state in URL params

**Testing**:
- Unit tests for query builder logic
- Integration tests for API endpoints
- E2E test: Browse events with filters
- E2E test: View event detail and return

**Deliverables**:
- Functional event browsing and filtering
- Event detail pages with external links
- Mobile-responsive design
- 80%+ test coverage for backend

**Success Criteria**:
- [ ] Users can view list of events
- [ ] Filters work correctly (location, date, type)
- [ ] Filter state preserved in URL
- [ ] Event detail pages load correctly
- [ ] External links open in new tab
- [ ] Mobile responsive (tested on real device)
- [ ] Lighthouse score 85+ on all metrics

---

### Phase 2: Authentication & Event Submission (Weeks 4-5)
**User Stories**: P2 - User Authentication, Manually Add Events

**Activities**:

**Week 4: Authentication System**
1. **Database tables**
   - Create `users` table with reputation fields
   - Add indexes for email lookup

2. **Auth API endpoints**
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - Login with JWT
   - `POST /api/auth/logout` - Logout (clear cookie)
   - `GET /api/auth/me` - Get current user

3. **Auth middleware**
   - `lib/middleware/auth.js` - JWT verification
   - `lib/utils/jwt.js` - Token generation/validation
   - `lib/utils/hash.js` - Password hashing (bcryptjs)

4. **Auth UI**
   - `public/auth.html` - Login/Register page
   - Form validation (client + server)
   - Error handling and display
   - Redirect after login

5. **Auth service**
   - `public/js/services/auth.js` - Auth state management
   - Store JWT in memory + httpOnly cookie
   - Auto-refresh on expiry
   - Global auth state in LocalStorage

**Week 5: Event Submission**
1. **Database updates**
   - Update `events` table with `status` and `submitted_by`
   - Create `approvals` table (Phase 3 prep)

2. **Event submission API**
   - `POST /api/events/create` - Create event (auth required)
   - Validation middleware for required fields
   - Image upload to Vercel Blob Storage
   - Set status to "pending"

3. **Submission UI**
   - `public/submit.html` - Event submission form
   - Form fields: title, description, location, date, type, URL
   - Image upload with preview
   - Client-side validation
   - Success/error feedback

4. **User profile**
   - `public/profile.html` - User profile page
   - Display reputation, submitted events
   - List of user's events with status
   - Edit pending events

5. **Rate limiting**
   - `lib/middleware/rate-limit.js` - 5 submissions/hour
   - Store limits in memory (or Redis if needed)

**Testing**:
- Unit tests for auth logic (JWT, hashing)
- Integration tests for auth endpoints
- E2E test: Register, login, submit event
- E2E test: Edit pending event

**Deliverables**:
- Working authentication system
- Event submission form
- User profile with submission history
- Rate limiting on submissions

**Success Criteria**:
- [ ] Users can register and login
- [ ] JWT authentication works correctly
- [ ] Users can submit events manually
- [ ] Submitted events appear in profile
- [ ] Image upload works (< 5MB limit)
- [ ] Rate limiting prevents spam
- [ ] Form validation prevents invalid submissions

---

### Phase 3: AI Integration - URL Parsing & Image Generation (Weeks 6-7)
**User Stories**: P2 - AI URL Parsing, P3 - AI Image Generation

**Activities**:

**Week 6: OpenAI URL Parsing**
1. **OpenAI service setup**
   - `lib/services/openai-service.js` - OpenAI SDK wrapper
   - Configuration with API key from env
   - Error handling and retry logic
   - Cost tracking and logging

2. **URL parsing endpoint**
   - `POST /api/events/parse-url` - Parse event from URL
   - Fetch HTML content from URL
   - Send to OpenAI GPT-4 with extraction prompt
   - Return structured JSON response
   - Handle parsing failures gracefully

3. **URL parsing prompt engineering**
   - Design extraction prompt template
   - Test with various event platforms:
     - Eventbrite
     - Facebook Events
     - Meetup
     - Custom event pages
   - Refine prompt based on accuracy testing

4. **Frontend integration**
   - Add URL input field to submission form
   - "Parse URL" button with loading state
   - Pre-fill form with parsed data
   - Allow user to edit all fields
   - Show parsing errors clearly

**Week 7: DALL-E Image Generation**
1. **Image generation endpoint**
   - `POST /api/images/generate` - Generate event image
   - Background job queue (simple in-memory initially)
   - DALL-E 3 API integration
   - Upload generated image to Vercel Blob Storage
   - Update event with image URL

2. **Image generation prompt engineering**
   - Design image prompt template
   - Include evHenter brand colors/style
   - Test variations for different event types
   - Refine for consistency and quality

3. **Generation status tracking**
   - Add `image_generation_status` to events table
   - Create `image_generations` table for tracking
   - Status endpoint: `GET /api/images/status/:jobId`

4. **Frontend integration**
   - Automatic generation for events without images
   - Show generation status on event detail page
   - Loading placeholder during generation
   - "Regenerate" button for authorized users
   - Fallback to default placeholder on failure

5. **Cost monitoring**
   - Log all OpenAI API calls with costs
   - Create admin dashboard for cost tracking
   - Set daily budget alerts
   - Implement caching for similar requests

**Testing**:
- Unit tests for OpenAI service wrapper
- Integration tests with OpenAI API (mocked)
- Manual testing with real event URLs
- Image quality evaluation (manual)

**Deliverables**:
- URL parsing functionality
- AI image generation system
- Cost monitoring dashboard
- Improved event submission UX

**Success Criteria**:
- [ ] URL parsing extracts ≥70% of fields correctly
- [ ] Users can edit parsed data before submission
- [ ] Image generation completes within 30 seconds
- [ ] Generated images match evHenter brand style
- [ ] Cost per event < $0.10 (parsing + image)
- [ ] Parsing failures fall back to manual entry
- [ ] Image generation failures show placeholder

---

### Phase 4: Community Approval & Saved Filters (Weeks 8-10)
**User Stories**: P3 - Community Approval System, Saved Filters

**Activities**:

**Week 8: Approval System Foundation**
1. **Reputation system**
   - Add reputation calculation logic
   - Update user reputation on approvals/rejections
   - Display reputation on profile

2. **Approval API**
   - `POST /api/approvals/approve` - Approve event
   - `POST /api/approvals/reject` - Reject event
   - Validation: reputation ≥ 50 or moderator role
   - Prevent self-approval
   - Count threshold: 3 approvals or 5 rejections

3. **Auto-publish logic**
   - Background job to check approval threshold
   - Update event status to "approved" or "rejected"
   - Notify submitter via email (optional)
   - Update reputation scores

**Week 9: Moderation UI**
1. **Moderation queue**
   - `public/moderation.html` - Pending events view
   - Display all pending events
   - Approve/Reject buttons
   - Optional feedback textarea
   - Filter by date, type

2. **Approval feedback**
   - Show approval/rejection count on events
   - Display feedback comments
   - Notification system for submitters

3. **Moderator tools**
   - Bulk approve/reject
   - Event reporting system
   - Admin override (instant approval)

**Week 10: Saved Filters**
1. **Saved filters API**
   - `GET /api/filters` - List user's saved filters
   - `POST /api/filters` - Create saved filter
   - `PATCH /api/filters/:id` - Update filter
   - `DELETE /api/filters/:id` - Delete filter

2. **Saved filters UI**
   - "Save Current Filter" button on filter panel
   - Name filter modal
   - Saved filters dropdown
   - Load filter on click
   - Edit/Delete saved filters
   - Limit to 20 saved filters per user

3. **Filter persistence**
   - Store filter criteria as JSON
   - Load and apply filter state
   - Update last used timestamp

**Testing**:
- Unit tests for reputation calculation
- Integration tests for approval logic
- E2E test: Full approval workflow
- E2E test: Save and load filter

**Deliverables**:
- Working community approval system
- Moderation queue for reviewers
- Saved filters functionality
- Reputation scoring system

**Success Criteria**:
- [ ] Users with reputation ≥50 can approve events
- [ ] Events auto-publish after 3 approvals
- [ ] Events auto-hide after 5 rejections
- [ ] Submitters receive feedback
- [ ] Reputation scores update correctly
- [ ] Users can save up to 20 filters
- [ ] Saved filters load correctly
- [ ] Moderators have enhanced controls

---

### Phase 5: Polish, Optimization & PWA (Weeks 11-12)
**Activities**:

**Week 11: Performance Optimization**
1. **Frontend optimization**
   - Code splitting (lazy load pages)
   - Image optimization (WebP conversion)
   - CSS minification
   - JavaScript bundling (optional - Rollup/esbuild)
   - Preload critical resources

2. **Backend optimization**
   - Database query optimization
   - Add indexes for common queries
   - Implement Redis caching (if needed)
   - API response caching headers

3. **PWA implementation**
   - Create service worker (`public/sw.js`)
   - Cache static assets
   - Cache API responses (stale-while-revalidate)
   - Offline page for network failures
   - Add to home screen prompt

4. **SEO optimization**
   - Server-side rendering for event pages (Vercel edge)
   - Meta tags for social sharing (Open Graph)
   - Structured data (JSON-LD) for events
   - Sitemap generation
   - robots.txt optimization

**Week 12: Testing, Documentation & Launch Prep**
1. **Comprehensive testing**
   - Complete E2E test suite for all user stories
   - Accessibility audit (WCAG 2.1 AA)
   - Cross-browser testing
   - Mobile device testing (iOS, Android)
   - Performance testing (Lighthouse CI)

2. **Documentation**
   - User guide / help pages
   - API documentation (if public API planned)
   - Contributing guidelines
   - Code documentation (JSDoc comments)

3. **Monitoring & Analytics**
   - Set up error tracking (Sentry or similar)
   - Set up analytics (Plausible or privacy-friendly)
   - Performance monitoring (Vercel Analytics)
   - Cost monitoring dashboard for OpenAI

4. **Launch preparation**
   - Production environment setup
   - Environment variables configured
   - Database backup strategy
   - Rollback plan
   - Soft launch with beta users

**Deliverables**:
- PWA with offline support
- Optimized performance (Lighthouse 90+)
- Complete test coverage (80%+)
- Production-ready application
- Comprehensive documentation

**Success Criteria**:
- [ ] Lighthouse score 90+ on all metrics
- [ ] PWA installable on mobile devices
- [ ] Offline browsing works for cached events
- [ ] All E2E tests passing
- [ ] WCAG 2.1 AA compliance verified
- [ ] Error tracking configured
- [ ] Analytics tracking user behavior
- [ ] Production deployment successful

---

## Technology Stack Summary

### Frontend
- **Languages**: HTML5, CSS3, JavaScript ES6+
- **Styling**: Custom CSS with CSS Grid/Flexbox, CSS Variables
- **Build**: None initially (vanilla JS), optional Rollup/esbuild for bundling later
- **Testing**: Node.js test runner, Playwright for E2E

### Backend
- **Runtime**: Node.js 18+ (Vercel serverless functions)
- **Database**: PostgreSQL (Vercel Postgres)
- **Authentication**: JWT tokens (jose library)
- **Password**: bcryptjs
- **File Storage**: Vercel Blob Storage
- **Testing**: Node.js test runner

### External Services
- **OpenAI API**: GPT-4 for URL parsing, DALL-E 3 for image generation
- **Hosting**: Vercel (frontend + serverless functions)
- **Repository**: GitHub
- **CI/CD**: GitHub Actions → Vercel

### Development Tools
- **Linting**: ESLint (StandardJS or Airbnb config)
- **Formatting**: Prettier
- **Version Control**: Git + GitHub
- **Local DB**: Docker PostgreSQL
- **API Testing**: Thunder Client or Postman

## Deployment Strategy

### GitHub Repository Setup
1. Create repository: `evHenter/event-platform`
2. Branch strategy:
   - `main` - Production (protected)
   - `develop` - Integration branch
   - `feature/*` - Feature branches
3. Required files:
   - `.gitignore` (node_modules, .env.local, .vercel)
   - `README.md` with setup instructions
   - `.env.example` with required variables

### Vercel Configuration
**vercel.json**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/public/$1" }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=0, stale-while-revalidate=3600" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'" }
      ]
    }
  ]
}
```

### Environment Variables
**Required** (set in Vercel dashboard):
```bash
# Database
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://...?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://..."

# Authentication
JWT_SECRET="<random-256-bit-secret>"
JWT_EXPIRES_IN="7d"
COOKIE_DOMAIN=".evhenter.com"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_ORG_ID="org-..." # Optional

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Email (Optional - Phase 4)
SMTP_HOST="smtp.sendgrid.net"
SMTP_USER="apikey"
SMTP_PASS="SG..."

# Feature Flags
ENABLE_AI_PARSING="true"
ENABLE_AI_IMAGES="true"
ENABLE_COMMUNITY_APPROVAL="false" # Enable in Phase 4

# Monitoring
SENTRY_DSN="https://..." # Optional
```

### CI/CD Pipeline
**GitHub Actions** (.github/workflows/ci.yml):
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run test:e2e

  deploy-preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Database Migrations
**Manual migration process** (simple SQL files):
1. Create migration file: `lib/db/migrations/001_initial_schema.sql`
2. Run locally: `psql $POSTGRES_URL < lib/db/migrations/001_initial_schema.sql`
3. Run on production: Use Vercel CLI or dashboard SQL editor
4. Track applied migrations in `schema_migrations` table

### Deployment Checklist
- [ ] GitHub repository created and code pushed
- [ ] Vercel project created and linked to GitHub
- [ ] Environment variables configured in Vercel
- [ ] Database created and schema applied
- [ ] OpenAI API key validated and tested
- [ ] Vercel Blob Storage enabled
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate auto-generated by Vercel
- [ ] Preview deployments working for PRs
- [ ] Production deployment successful
- [ ] Error tracking configured
- [ ] Analytics configured

## Risk Assessment & Mitigation

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Vanilla JS complexity grows** | High | Medium | Introduce lightweight library (Preact/Alpine) if needed |
| **OpenAI API costs exceed budget** | High | Medium | Implement caching, rate limiting, daily budget caps |
| **OpenAI parsing accuracy too low** | Medium | Medium | Fallback to manual entry, improve prompts iteratively |
| **Database query performance** | Medium | Low | Add indexes, implement caching, optimize queries |
| **Serverless cold starts** | Low | High | Accept tradeoff, consider Vercel Pro for reduced cold starts |
| **Image storage costs** | Medium | Low | Implement image compression, CDN caching, cleanup old images |

### Project Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Scope creep** | High | High | Strict adherence to phased plan, defer nice-to-haves |
| **AI integration delays** | Medium | Medium | Implement manual alternatives first, AI as enhancement |
| **Low community participation** | High | Medium | Seed initial events, invite beta users, gamify contributions |
| **Spam/malicious submissions** | High | Medium | Robust rate limiting, content moderation, reputation system |
| **Insufficient testing** | Medium | Medium | TDD approach, automated CI pipeline, Phase 5 dedicated to QA |

## Success Metrics

### Phase 1 (MVP)
- [ ] Main event list loads in < 2s
- [ ] Users can apply filters successfully 100% of time
- [ ] 90%+ of users can navigate to event detail
- [ ] Mobile responsive works on iOS/Android

### Phase 2 (Auth & Submission)
- [ ] Users can register/login successfully
- [ ] Event submission form completes without errors
- [ ] 80%+ of submissions have complete information

### Phase 3 (AI Integration)
- [ ] URL parsing accuracy ≥ 70% for major platforms
- [ ] AI image generation success rate ≥ 85%
- [ ] Cost per event < $0.10

### Phase 4 (Community)
- [ ] Events receive approval within 24 hours (average)
- [ ] 60%+ of submitted events get approved
- [ ] Users actively use saved filters (≥50% of auth users)

### Phase 5 (Launch)
- [ ] Lighthouse score 90+ on all metrics
- [ ] 500+ events in database
- [ ] 100+ registered users
- [ ] 1000+ daily page views

## Open Questions & Decisions

### ✅ RESOLVED - See decisions.md for full details

All key technical decisions have been made and documented in [decisions.md](decisions.md).

### Immediate (Phase 0)
1. ✅ **Hosting**: Vercel confirmed
2. ✅ **Source control**: GitHub confirmed
3. ✅ **Frontend approach**: Vanilla HTML/CSS/JS confirmed
4. ✅ **AI provider**: OpenAI confirmed
5. ✅ **Database choice**: Vercel Postgres
6. ✅ **Authentication**: Email/Password + Vercel Auth (OAuth for Google, GitHub)
7. ✅ **Domain name**: evHenter.ai
8. ⚠️ **Email service**: TBD (Phase 4 - SendGrid or Resend for notifications)

### Phase 1
9. ✅ **CSS approach**: Custom CSS with CSS Variables (theme: indigo/purple/pink)
10. ✅ **Date picker**: Native HTML5 `<input type="date">`
11. ✅ **Image placeholders**: Custom illustrated placeholders per event type

### Phase 3
12. ✅ **OpenAI models**: GPT-4 Turbo (balance of speed/cost/quality)
13. ✅ **DALL-E version**: DALL-E 3 (quality over cost)
14. ✅ **Background jobs**: In-memory queue (MVP) → BullMQ + Vercel KV (Scale)

### Phase 4
15. ✅ **Moderation start**: Moderator-only initially → Community approval in Phase 4
16. ✅ **Reputation algorithm**: Simple count (Phase 4) → Weighted by quality (Phase 5+)

### Phase 5
17. ✅ **Analytics**: Plausible Analytics (privacy-friendly)
18. ✅ **Error tracking**: Sentry (generous free tier)

### Cost Projections (Monthly)
- Infrastructure (Vercel): $0-44
- AI Services (OpenAI): $25-50
- Monitoring: $0-9
- **Total**: $30-100/month

## Next Steps

1. **Review this plan** with stakeholders/team
2. **Answer open questions** in "Open Questions & Decisions" section
3. **Execute Phase 0** (Research & Setup)
   - Set up GitHub repository
   - Configure Vercel project
   - Create database schema
   - Document in `research.md`, `data-model.md`, `api-contracts.md`
4. **Generate task breakdown** via `/speckit.tasks` command for Phase 1
5. **Begin implementation** following TDD approach per constitution

---

**Plan Status**: Ready for review
**Estimated Timeline**: 12 weeks to full launch
**Required Resources**: 1-2 developers, OpenAI API budget (~$100/month initially)
**Confidence Level**: High (building on proven technologies, clear scope)
