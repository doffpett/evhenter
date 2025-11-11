# Tasks: evHenter - Community Event Discovery Platform

**Input**: Design documents from `specs/002-event-management/`
**Prerequisites**: plan.md ✅, spec-event-management.md ✅

**Organization**: Tasks are grouped by implementation phase and user story to enable independent implementation and testing. Focus on Phase 0 (Setup) and Phase 1 (MVP - User Stories 1 & 2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story/phase this task belongs to (Setup, US1, US2, etc.)
- Exact file paths included in descriptions

## Path Conventions

Web application structure (per plan.md):
- **Frontend**: `public/` directory (HTML, CSS, JS)
- **Backend**: `api/` directory (Vercel serverless functions)
- **Shared**: `lib/` directory (backend utilities)
- **Tests**: `tests/` directory

---

## Phase 0: Setup & Foundation (Week 1)

**Purpose**: Project initialization, development environment, and core infrastructure

### Infrastructure Setup

- [ ] T001 [P] [Setup] Create `package.json` with Node.js 18+ and essential dependencies (openai, pg, jose, bcryptjs)
- [ ] T002 [P] [Setup] Create `.env.example` with required environment variables (POSTGRES_URL, JWT_SECRET, OPENAI_API_KEY, BLOB_READ_WRITE_TOKEN)
- [ ] T003 [P] [Setup] Configure ESLint in `.eslintrc.json` with StandardJS or Airbnb config for vanilla JS
- [ ] T004 [P] [Setup] Configure Prettier in `.prettierrc` for consistent code formatting
- [ ] T005 [P] [Setup] Create `vercel.json` with routing configuration for static files and API functions
- [ ] T006 [P] [Setup] Create `.github/workflows/ci.yml` for automated testing and linting on push

### Database Setup

- [ ] T007 [Setup] Create database schema in `lib/db/schema.sql` with initial tables (events, locations, event_types)
- [ ] T008 [Setup] Create database connection pool in `lib/db/connection.js` using pg library
- [ ] T009 [Setup] Create parameterized queries module in `lib/db/queries.js` for events, locations, types
- [ ] T010 [Setup] Create database seed script in `lib/db/seed.js` with 50+ diverse test events
- [ ] T011 [Setup] Create migration tracking table and system in `lib/db/migrations/`
- [ ] T012 [Setup] Document database schema in `specs/002-event-management/data-model.md`

### Backend Infrastructure

- [ ] T013 [P] [Setup] Create error handling middleware in `lib/middleware/error-handler.js`
- [ ] T014 [P] [Setup] Create request validation middleware in `lib/middleware/validate.js`
- [ ] T015 [P] [Setup] Create logger utility in `lib/utils/logger.js` for structured logging
- [ ] T016 [P] [Setup] Create validation schemas in `lib/utils/validators.js` using manual validation functions
- [ ] T017 [P] [Setup] Create Event model with CRUD methods in `lib/models/event.js`
- [ ] T018 [P] [Setup] Create Location model in `lib/models/location.js`

### Frontend Infrastructure

- [ ] T019 [P] [Setup] Create base HTML structure in `public/index.html` with semantic markup
- [ ] T020 [P] [Setup] Create global CSS in `public/css/styles.css` with CSS variables for theming
- [ ] T021 [P] [Setup] Create component styles in `public/css/components.css`
- [ ] T022 [P] [Setup] Create responsive layout styles in `public/css/responsive.css` with mobile-first breakpoints
- [ ] T023 [P] [Setup] Create API client wrapper in `public/js/services/api.js` with fetch and error handling
- [ ] T024 [P] [Setup] Create DOM utility helpers in `public/js/utils/dom.js`
- [ ] T025 [P] [Setup] Create date formatting utilities in `public/js/utils/date.js`
- [ ] T026 [P] [Setup] Create client-side router in `public/js/router.js` using History API

### Documentation

- [ ] T027 [P] [Setup] Create API contracts documentation in `specs/002-event-management/api-contracts.md`
- [ ] T028 [P] [Setup] Create developer quickstart guide in `specs/002-event-management/quickstart.md`
- [ ] T029 [P] [Setup] Update README.md with current setup instructions and project status

**Checkpoint**: ✅ Development environment ready, database accessible, basic project structure in place

---

## Phase 1: User Story 1 - Browse and Filter Events (Priority: P1) 🎯 MVP

**Goal**: Users can discover events through an intuitive main view with real-time filtering by location, city, date range, and event type

**Independent Test**: Seed database with 50+ events, verify users can browse and filter events within 3 clicks

### Backend API for User Story 1

- [ ] T030 [US1] Create GET `/api/events` endpoint in `api/events/index.js` for listing events with pagination
- [ ] T031 [US1] Implement dynamic query builder in `lib/db/queries.js` for filter combinations (location, date, type)
- [ ] T032 [US1] Add pagination logic (24 events per page) to events query in `api/events/index.js`
- [ ] T033 [US1] Add sorting options (date asc/desc, popularity) to events query
- [ ] T034 [US1] Create GET `/api/metadata/locations` endpoint in `api/metadata/locations.js` for city dropdown
- [ ] T035 [US1] Create GET `/api/metadata/types` endpoint in `api/metadata/types.js` for event type filter
- [ ] T036 [US1] Add response caching headers (5 min) to metadata endpoints
- [ ] T037 [US1] Implement error handling for all US1 endpoints using error-handler middleware

### Frontend - Main Event List Page

- [ ] T038 [P] [US1] Create event card component in `public/js/components/event-card.js` with template literal
- [ ] T039 [P] [US1] Create skeleton loader component in `public/js/components/skeleton.js`
- [ ] T040 [US1] Implement event service in `public/js/services/events.js` for API calls (list, filters)
- [ ] T041 [US1] Create main page logic in `public/js/pages/home.js` for initial event loading
- [ ] T042 [US1] Implement event grid rendering in `public/js/pages/home.js` with responsive CSS Grid
- [ ] T043 [US1] Add lazy loading for event images in event card component

### Frontend - Filter Panel

- [ ] T044 [P] [US1] Create filter panel component in `public/js/components/filter-panel.js`
- [ ] T045 [US1] Implement location autocomplete dropdown in filter panel (native datalist or custom)
- [ ] T046 [US1] Implement date range picker in filter panel (native input type="date")
- [ ] T047 [US1] Implement event type checkboxes in filter panel
- [ ] T048 [US1] Add "Clear All Filters" button functionality
- [ ] T049 [US1] Add active filter count badge display
- [ ] T050 [US1] Implement filter state persistence in URL query parameters
- [ ] T051 [US1] Add mobile filter panel (modal/drawer on mobile, sidebar on desktop)
- [ ] T052 [US1] Implement real-time filter application (debounced, no page reload)

### Frontend - Empty States & Polish

- [ ] T053 [P] [US1] Create empty state component in `public/js/components/empty-state.js` with suggestions
- [ ] T054 [P] [US1] Create loading state (skeleton grid) for initial page load
- [ ] T055 [US1] Implement pagination controls (prev/next, page numbers)
- [ ] T056 [US1] Add scroll-to-top on page change
- [ ] T057 [US1] Add keyboard navigation for filters (tab order, enter to apply)

### Testing for User Story 1

- [ ] T058 [P] [US1] Write unit test for query builder in `tests/unit/queries.test.js`
- [ ] T059 [P] [US1] Write integration test for GET /api/events endpoint in `tests/integration/api/events.test.js`
- [ ] T060 [P] [US1] Write E2E test for browsing events in `tests/e2e/browse-events.spec.js`
- [ ] T061 [P] [US1] Write E2E test for filtering by location in `tests/e2e/browse-events.spec.js`
- [ ] T062 [P] [US1] Write E2E test for filtering by date range in `tests/e2e/browse-events.spec.js`
- [ ] T063 [P] [US1] Write E2E test for mobile filter panel behavior in `tests/e2e/browse-events.spec.js`

**Checkpoint**: ✅ User Story 1 complete - Users can browse and filter events on desktop and mobile

---

## Phase 1: User Story 2 - View Event Details (Priority: P1) 🎯 MVP

**Goal**: Users can click any event card to view comprehensive event details with external link to original event page

**Independent Test**: Create single event, verify navigation from main view to detail page with all information displayed

### Backend API for User Story 2

- [ ] T064 [US2] Create GET `/api/events/[id]` endpoint in `api/events/[id].js` for single event details
- [ ] T065 [US2] Add event view count increment logic in GET `/api/events/[id]`
- [ ] T066 [US2] Add 404 handling for non-existent event IDs
- [ ] T067 [US2] Add caching headers (1 hour) for event detail responses

### Frontend - Event Detail Page

- [ ] T068 [US2] Create event detail page HTML in `public/event-detail.html`
- [ ] T069 [US2] Create event detail page logic in `public/js/pages/event-detail.js`
- [ ] T070 [US2] Fetch and display event data from API in event detail page
- [ ] T071 [US2] Display event cover image (responsive, lazy load)
- [ ] T072 [US2] Display event title, description (short + long), date/time, location
- [ ] T073 [US2] Display "Visit Event Page" CTA button opening in new tab
- [ ] T074 [US2] Add back button with filter state preservation (use History API)
- [ ] T075 [US2] Add social sharing buttons (Facebook, Twitter, LinkedIn, Copy Link)
- [ ] T076 [US2] Implement mobile-responsive layout (no horizontal scroll)
- [ ] T077 [US2] Add loading state while fetching event details
- [ ] T078 [US2] Add error state for failed fetches or 404 events

### Navigation Integration

- [ ] T079 [US2] Update event card click handler to navigate to detail page with event ID
- [ ] T080 [US2] Implement URL routing for `/event/:id` in router.js
- [ ] T081 [US2] Preserve filter state when navigating back from detail page
- [ ] T082 [US2] Add breadcrumb navigation (Home > Event Name)

### Testing for User Story 2

- [ ] T083 [P] [US2] Write integration test for GET /api/events/:id endpoint in `tests/integration/api/events.test.js`
- [ ] T084 [P] [US2] Write E2E test for viewing event detail in `tests/e2e/event-detail.spec.js`
- [ ] T085 [P] [US2] Write E2E test for external link opening in new tab in `tests/e2e/event-detail.spec.js`
- [ ] T086 [P] [US2] Write E2E test for back button with filter preservation in `tests/e2e/event-detail.spec.js`
- [ ] T087 [P] [US2] Write E2E test for mobile responsive layout in `tests/e2e/event-detail.spec.js`

**Checkpoint**: ✅ User Story 2 complete - Users can view detailed event information and navigate back with filters intact

---

## Phase 1: Polish & Performance (Week 3)

**Purpose**: Optimize Phase 1 MVP for performance and UX quality

### Performance Optimization

- [ ] T088 [P] [Polish] Implement image lazy loading with Intersection Observer in `public/js/utils/lazy-load.js`
- [ ] T089 [P] [Polish] Add image placeholder (blur-up) during load
- [ ] T090 [P] [Polish] Optimize CSS for above-the-fold content (inline critical CSS)
- [ ] T091 [P] [Polish] Add service worker for static asset caching in `public/sw.js` (optional PWA prep)
- [ ] T092 [P] [Polish] Implement debouncing for filter inputs in filter panel (300ms delay)
- [ ] T093 [P] [Polish] Add request caching in API service (5 min memory cache)

### Accessibility

- [ ] T094 [P] [Polish] Add ARIA labels to all interactive elements (buttons, links, inputs)
- [ ] T095 [P] [Polish] Ensure proper heading hierarchy (h1 → h2 → h3)
- [ ] T096 [P] [Polish] Add skip-to-content link for keyboard users
- [ ] T097 [P] [Polish] Verify color contrast meets WCAG 2.1 AA (4.5:1 for text)
- [ ] T098 [P] [Polish] Test keyboard navigation (tab order, enter, escape)
- [ ] T099 [P] [Polish] Add focus indicators for all interactive elements

### Error Handling & UX

- [ ] T100 [P] [Polish] Create toast notification component in `public/js/components/toast.js`
- [ ] T101 [P] [Polish] Add network error handling with retry button
- [ ] T102 [P] [Polish] Add loading timeout handling (show error after 10s)
- [ ] T103 [P] [Polish] Implement optimistic UI updates for filter changes

### Testing & Validation

- [ ] T104 [Polish] Run Lighthouse audit - target 90+ on all metrics (Performance, Accessibility, SEO, Best Practices)
- [ ] T105 [Polish] Test on real mobile devices (iOS Safari, Android Chrome)
- [ ] T106 [Polish] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] T107 [Polish] Verify test coverage meets 80% threshold
- [ ] T108 [Polish] Manual accessibility testing with keyboard only
- [ ] T109 [Polish] Manual accessibility testing with screen reader (NVDA or VoiceOver)

**Checkpoint**: ✅ Phase 1 MVP complete - Ready for Phase 2 (Authentication & Submission)

---

## Phase 2: User Story 8 - User Authentication & Profiles (Priority: P2)

**Goal**: Users can create accounts, login, and view their profile with submitted events

**Independent Test**: Register new user, login, verify authentication persists across sessions

### Database Setup for Authentication

- [ ] T110 [US8] Add `users` table to `lib/db/schema.sql` with auth fields (email, password_hash, reputation)
- [ ] T111 [US8] Run migration to create users table in database
- [ ] T112 [US8] Create User model with CRUD methods in `lib/models/user.js`
- [ ] T113 [US8] Add indexes on users.email for fast lookup

### Backend - Authentication Middleware & Utilities

- [ ] T114 [P] [US8] Create JWT utilities in `lib/utils/jwt.js` (generate, verify tokens using jose)
- [ ] T115 [P] [US8] Create password hashing utilities in `lib/utils/hash.js` (bcrypt hash, compare)
- [ ] T116 [US8] Create auth middleware in `lib/middleware/auth.js` for JWT verification
- [ ] T117 [US8] Add user session context to request object in auth middleware

### Backend - Auth API Endpoints

- [ ] T118 [US8] Create POST `/api/auth/register` endpoint in `api/auth/register.js`
- [ ] T119 [US8] Add email validation (format, uniqueness) to register endpoint
- [ ] T120 [US8] Add password strength validation (min 8 chars) to register endpoint
- [ ] T121 [US8] Hash password and create user record in register endpoint
- [ ] T122 [US8] Generate JWT token and set httpOnly cookie in register endpoint
- [ ] T123 [US8] Create POST `/api/auth/login` endpoint in `api/auth/login.js`
- [ ] T124 [US8] Verify email + password and generate JWT in login endpoint
- [ ] T125 [US8] Create POST `/api/auth/logout` endpoint in `api/auth/logout.js` to clear cookie
- [ ] T126 [US8] Create GET `/api/auth/me` endpoint in `api/auth/me.js` for current user info (protected)

### Frontend - Auth Pages & UI

- [ ] T127 [US8] Create auth page HTML in `public/auth.html` with tabs for login/register
- [ ] T128 [US8] Create auth service in `public/js/services/auth.js` for API calls and state management
- [ ] T129 [US8] Create auth page logic in `public/js/pages/auth-page.js`
- [ ] T130 [US8] Implement registration form with validation (email format, password match)
- [ ] T131 [US8] Implement login form with validation
- [ ] T132 [US8] Add client-side password strength indicator
- [ ] T133 [US8] Store auth state in localStorage (user info only, not token)
- [ ] T134 [US8] Implement auto-redirect after successful login (to previous page or home)
- [ ] T135 [US8] Add logout functionality to header navigation
- [ ] T136 [US8] Update header to show user name/avatar when authenticated

### Frontend - User Profile Page

- [ ] T137 [US8] Create profile page HTML in `public/profile.html`
- [ ] T138 [US8] Create profile page logic in `public/js/pages/profile.js`
- [ ] T139 [US8] Fetch and display user info (name, email, reputation score)
- [ ] T140 [US8] Display list of user's submitted events with status badges
- [ ] T141 [US8] Add profile edit form (name, password change)
- [ ] T142 [US8] Protect profile page - redirect to auth if not logged in

### Testing for User Story 8

- [ ] T143 [P] [US8] Write unit tests for JWT utilities in `tests/unit/jwt.test.js`
- [ ] T144 [P] [US8] Write unit tests for password hashing in `tests/unit/hash.test.js`
- [ ] T145 [P] [US8] Write integration tests for register endpoint in `tests/integration/api/auth.test.js`
- [ ] T146 [P] [US8] Write integration tests for login endpoint in `tests/integration/api/auth.test.js`
- [ ] T147 [P] [US8] Write E2E test for user registration in `tests/e2e/auth.spec.js`
- [ ] T148 [P] [US8] Write E2E test for user login/logout in `tests/e2e/auth.spec.js`
- [ ] T149 [P] [US8] Write E2E test for protected route access in `tests/e2e/auth.spec.js`

**Checkpoint**: ✅ User Story 8 complete - Users can register, login, and view their profile

---

## Phase 2: User Story 3 - Manually Add Events (Priority: P2)

**Goal**: Authenticated users can submit events manually through a form, events enter pending status

**Independent Test**: Login, submit event with all required fields, verify event appears in profile with pending status

### Database Setup for Event Submission

- [ ] T150 [US3] Add `submitted_by` and `status` columns to events table in `lib/db/schema.sql`
- [ ] T151 [US3] Run migration to update events table
- [ ] T152 [US3] Update Event model to support status filtering and user association

### Backend - Event Submission API

- [ ] T153 [US3] Create POST `/api/events/create` endpoint in `api/events/create.js` (auth required)
- [ ] T154 [US3] Add request validation for all required fields (title, description, location, date, type)
- [ ] T155 [US3] Validate event dates are in future (or allow past with flag)
- [ ] T156 [US3] Set event status to "pending" on creation
- [ ] T157 [US3] Associate event with authenticated user (submitted_by)
- [ ] T158 [US3] Return created event with status to client
- [ ] T159 [US3] Create PATCH `/api/events/update` endpoint in `api/events/update.js` for editing pending events
- [ ] T160 [US3] Verify user owns event before allowing edit (authorization check)
- [ ] T161 [US3] Prevent editing of approved/rejected events

### Backend - Rate Limiting

- [ ] T162 [US3] Create rate limiting middleware in `lib/middleware/rate-limit.js`
- [ ] T163 [US3] Implement in-memory rate limit store (user ID → submission count/timestamp)
- [ ] T164 [US3] Apply rate limit (5 submissions per hour) to event creation endpoint
- [ ] T165 [US3] Return 429 status with retry-after header when limit exceeded

### Backend - Image Upload (Optional for MVP)

- [ ] T166 [P] [US3] Create image upload endpoint POST `/api/images/upload` in `api/images/upload.js` (optional)
- [ ] T167 [P] [US3] Integrate Vercel Blob Storage for image uploads (optional)
- [ ] T168 [P] [US3] Add image size validation (max 5MB) and format check (JPG, PNG, WebP) (optional)

### Frontend - Event Submission Form

- [ ] T169 [US3] Create event submission page HTML in `public/submit.html`
- [ ] T170 [US3] Create event submission page logic in `public/js/pages/submit.js`
- [ ] T171 [US3] Create form validation component in `public/js/components/form-validator.js`
- [ ] T172 [US3] Implement event submission form with all required fields
- [ ] T173 [US3] Add client-side validation for required fields with inline error messages
- [ ] T174 [US3] Add date picker for start/end dates with future date validation
- [ ] T175 [US3] Add location autocomplete (reuse from filter panel)
- [ ] T176 [US3] Add event type dropdown
- [ ] T177 [US3] Add image upload input with preview (optional)
- [ ] T178 [US3] Add character count for description fields
- [ ] T179 [US3] Implement form submission with loading state
- [ ] T180 [US3] Show success message with link to profile after submission
- [ ] T181 [US3] Show error messages for validation failures or network errors

### Frontend - Profile Integration

- [ ] T182 [US3] Add "Add Event" button to header navigation (auth required)
- [ ] T183 [US3] Update profile page to fetch user's submitted events
- [ ] T184 [US3] Display submitted events with status badges (pending/approved/rejected)
- [ ] T185 [US3] Add edit button for pending events
- [ ] T186 [US3] Create edit event modal reusing submission form

### Testing for User Story 3

- [ ] T187 [P] [US3] Write unit tests for event validation in `tests/unit/validators.test.js`
- [ ] T188 [P] [US3] Write unit tests for rate limiting logic in `tests/unit/rate-limit.test.js`
- [ ] T189 [P] [US3] Write integration tests for POST /api/events/create in `tests/integration/api/events.test.js`
- [ ] T190 [P] [US3] Write E2E test for event submission in `tests/e2e/submit-event.spec.js`
- [ ] T191 [P] [US3] Write E2E test for form validation in `tests/e2e/submit-event.spec.js`
- [ ] T192 [P] [US3] Write E2E test for rate limiting in `tests/e2e/submit-event.spec.js`
- [ ] T193 [P] [US3] Write E2E test for editing pending event in `tests/e2e/submit-event.spec.js`

**Checkpoint**: ✅ User Story 3 complete - Users can submit events and see them in their profile

---

## Phase 2: Verification & Deployment

**Purpose**: Ensure Phase 2 features are production-ready

### Testing & Quality

- [ ] T194 [Polish] Run full E2E test suite for Phases 1 & 2
- [ ] T195 [Polish] Verify authentication security (JWT expiry, httpOnly cookies, CSRF protection)
- [ ] T196 [Polish] Test rate limiting effectiveness under load
- [ ] T197 [Polish] Update test coverage report - verify 80%+ coverage
- [ ] T198 [Polish] Perform security audit on auth endpoints

### Documentation & Deployment

- [ ] T199 [P] [Polish] Update README.md with Phase 2 features and setup instructions
- [ ] T200 [P] [Polish] Update API contracts documentation with new endpoints
- [ ] T201 [Polish] Create deployment checklist in docs/
- [ ] T202 [Polish] Deploy to Vercel staging environment
- [ ] T203 [Polish] Smoke test on staging (registration, login, event submission)
- [ ] T204 [Polish] Deploy to production if staging tests pass

**Checkpoint**: ✅ Phase 2 complete - Users can register, login, and submit events

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 0 (Setup)**: No dependencies - start immediately
2. **Phase 1 (US1, US2)**: Depends on Phase 0 completion
   - US1 and US2 can proceed in parallel (different pages)
3. **Phase 2 (US8, US3)**: Depends on Phase 1 completion (reuses components)
   - US8 (Auth) MUST complete before US3 (requires authentication)

### User Story Dependencies

- **User Story 1** (Browse): Can start after Phase 0 - No dependencies
- **User Story 2** (Event Detail): Depends on US1 (reuses event card click navigation)
- **User Story 8** (Auth): Can start after Phase 0 - No dependencies on US1/US2
- **User Story 3** (Submit): Depends on US8 (requires authentication) - reuses components from US1

### Parallel Opportunities

**Phase 0**: All tasks marked [P] can run in parallel:
- T001-T006 (Infrastructure setup)
- T013-T018 (Backend infrastructure)
- T019-T026 (Frontend infrastructure)
- T027-T029 (Documentation)

**Phase 1**:
- US1 Backend (T030-T037) and US1 Frontend (T038-T057) can run in parallel
- US1 and US2 can be developed by different team members in parallel (minimal overlap)
- All tests marked [P] within each story can run in parallel

**Phase 2**:
- US8 Backend (T114-T126) and US8 Frontend (T127-T142) can run in parallel after database setup
- All tests marked [P] within each story can run in parallel

---

## Implementation Strategies

### Strategy 1: MVP First (Single Developer)

1. Complete Phase 0: Setup (T001-T029)
2. Complete User Story 1: Browse Events (T030-T063)
3. Complete User Story 2: Event Detail (T064-T087)
4. **STOP and VALIDATE**: Deploy Phase 1 MVP, gather user feedback
5. Complete User Story 8: Authentication (T110-T149)
6. Complete User Story 3: Submit Events (T150-T193)
7. Deploy Phase 2 with auth and submissions

### Strategy 2: Parallel Team (2 Developers)

**Week 1**: Both complete Phase 0 together
**Week 2-3**:
- Developer A: User Story 1 (Browse)
- Developer B: User Story 2 (Event Detail)
**Week 4**:
- Developer A: User Story 8 (Auth)
- Developer B: Polish Phase 1
**Week 5**:
- Both: User Story 3 (Submit Events)

### Strategy 3: Iterative Deployment

1. Phase 0 → Deploy empty shell
2. Phase 0 + US1 → Deploy browsable event list (no details yet)
3. Phase 0 + US1 + US2 → Deploy full Phase 1 MVP
4. Add US8 → Deploy with authentication
5. Add US3 → Deploy with event submission

---

## Notes for Implementation

### Critical Path
- Phase 0 (Setup) blocks everything
- User Story 8 (Auth) blocks User Story 3 (Submit)
- All other user stories are relatively independent

### Risk Areas
- **OpenAI Integration**: Deferred to Phase 3 - manual submission must work first
- **Image Upload**: Optional for MVP - can use placeholder images initially
- **Rate Limiting**: Simple in-memory implementation - may need Redis for production scale

### Quality Gates
- [ ] All tests pass before merging to main
- [ ] Lighthouse score 85+ for each phase
- [ ] Manual accessibility check with keyboard
- [ ] Cross-browser testing before deployment

### Commit Strategy
- Commit after completing each task or logical group (e.g., T030-T033 together)
- Use conventional commit format: `feat(US1): implement events listing API`
- Create PR per user story for review

---

**Total Tasks**: 204
**Phase 0 (Setup)**: 29 tasks
**Phase 1 (MVP)**: 80 tasks (US1: 34 tasks, US2: 24 tasks, Polish: 22 tasks)
**Phase 2**: 95 tasks (US8: 40 tasks, US3: 45 tasks, Deploy: 10 tasks)

**Estimated Timeline**:
- Phase 0: 1 week
- Phase 1: 2 weeks
- Phase 2: 2 weeks
- **Total**: 5 weeks for foundational features (Phases 0-2)
