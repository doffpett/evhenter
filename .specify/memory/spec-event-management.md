# Feature Specification: evHenter - Community Event Discovery Platform

**Feature Branch**: `002-event-management-system`
**Created**: 2025-11-11
**Status**: Draft
**Input**: User description: "Build an application that can help me organize events to attend. it should be possible to filter events based on location, city, time and date, type of event. there should also be possible for users to add events manually, with a community type of approval system... events should also be possible to parse based on url to the events landing page. users can also create their custom saved filters. each event should have a detailed page with an url to the original landing page. the main view should show smaller titles of the events based on selected filtering... we should use openai for parsing and generating pictures for the event in correct design for the overall evhenter theme"

## User Scenarios & Testing

### User Story 1 - Browse and Filter Events (Priority: P1)

Users can discover events through an intuitive main view with real-time filtering capabilities. The interface displays event cards with essential information (title, date, location, type) and allows multi-criteria filtering including location, city, date/time ranges, and event types.

**Why this priority**: This is the core value proposition - helping users find relevant events. Without basic browsing and filtering, the application provides no value. This establishes the foundation for all other features.

**Independent Test**: Can be fully tested by seeding a database with 50+ diverse events across different cities, dates, and types. Success criteria: Users can find specific events using any combination of filters within 3 clicks.

**Acceptance Scenarios**:

1. **Given** I am on the main events page, **When** I select "Oslo" as location filter, **Then** only events in Oslo are displayed
2. **Given** I have applied multiple filters (location + date range), **When** I clear filters, **Then** all events are displayed again
3. **Given** I am viewing filtered events, **When** I select an event type filter, **Then** the results update instantly without page reload
4. **Given** no events match my filter criteria, **When** filters are applied, **Then** I see a helpful empty state with suggestions to broaden search
5. **Given** I am on mobile device, **When** I apply filters, **Then** the filter panel collapses automatically after selection

---

### User Story 2 - View Event Details (Priority: P1)

Users can click any event card to view a comprehensive detail page showing full event information, AI-generated themed cover image, description, venue details, date/time, event type, and a prominent link to the original event landing page.

**Why this priority**: Event details are essential for users to make attendance decisions. This completes the basic read-only user journey (browse → view details → visit external site).

**Independent Test**: Can be tested by creating a single event with complete information. Success criteria: Users can navigate from main view to detail page and access all event information including external link.

**Acceptance Scenarios**:

1. **Given** I am viewing an event card, **When** I click it, **Then** I navigate to detailed event page with all information
2. **Given** I am on event detail page, **When** I click "Visit Event Page" button, **Then** original event URL opens in new tab
3. **Given** I am viewing event details, **When** I click browser back button, **Then** I return to main view with my previous filters intact
4. **Given** event has AI-generated cover image, **When** detail page loads, **Then** image is displayed with evHenter themed styling
5. **Given** I am on mobile device, **When** viewing event details, **Then** all content is readable without horizontal scrolling

---

### User Story 3 - Manually Add Events (Priority: P2)

Authenticated users can contribute events to the community by filling out a comprehensive event submission form. The form includes fields for event name, description, location, city, date/time, event type, and original URL. Submitted events enter a pending state awaiting community approval.

**Why this priority**: Community contributions are essential for platform growth and keeping content fresh. However, users must first discover existing events (P1) before being motivated to contribute.

**Independent Test**: Can be tested by creating a user account and submitting a test event through the form. Success criteria: Event is saved with "pending" status and appears in moderation queue.

**Acceptance Scenarios**:

1. **Given** I am authenticated user, **When** I click "Add Event" button, **Then** event submission form modal opens
2. **Given** I am filling event form, **When** I submit with missing required fields, **Then** validation errors are displayed inline
3. **Given** I complete all form fields, **When** I click submit, **Then** event is saved with "pending" status and I see success confirmation
4. **Given** I have submitted an event, **When** I view my profile, **Then** I can see status of my submitted events
5. **Given** I am unauthenticated user, **When** I try to add event, **Then** I am prompted to login/register first

---

### User Story 4 - AI-Powered URL Event Parsing (Priority: P2)

Users can paste a URL to an event landing page, and the system automatically extracts event information using OpenAI's parsing capabilities. The extracted data pre-fills the event submission form, which users can review and edit before submission.

**Why this priority**: This significantly reduces friction for event submission and improves data quality. However, manual submission (P2) must work first as a fallback.

**Independent Test**: Can be tested by providing URLs from popular event platforms (Eventbrite, Facebook Events, Meetup). Success criteria: System extracts at least 70% of fields correctly for well-structured event pages.

**Acceptance Scenarios**:

1. **Given** I am on add event form, **When** I paste event URL and click "Parse", **Then** OpenAI extracts event details and pre-fills form
2. **Given** OpenAI has parsed event data, **When** I review pre-filled form, **Then** I can edit any field before submission
3. **Given** URL parsing fails, **When** error occurs, **Then** I see clear error message and can manually fill form instead
4. **Given** URL has been parsed successfully, **When** I submit, **Then** original URL is stored with event for attribution
5. **Given** parsing is in progress, **When** waiting for OpenAI response, **Then** I see loading indicator with estimated time

---

### User Story 5 - Community Approval System (Priority: P3)

The platform implements a trust-based approval system where events require community validation before appearing publicly. Users earn reputation through approved contributions. Events need 3 approvals from users with reputation ≥ 50, or 1 approval from moderator/admin. Users can upvote/downvote pending events with optional feedback.

**Why this priority**: Quality control is important for platform credibility, but the system needs events and active users first (P1-P2). Early stage can use lighter moderation.

**Independent Test**: Can be tested by creating multiple test users with different reputation levels and submitting events for approval. Success criteria: Events transition from pending → approved after meeting approval threshold.

**Acceptance Scenarios**:

1. **Given** I am user with reputation ≥ 50, **When** I view pending events queue, **Then** I can approve/reject events with optional comment
2. **Given** event receives 3 approvals from qualified users, **When** threshold is met, **Then** event automatically publishes and appears in main view
3. **Given** event receives 5 rejections, **When** threshold is met, **Then** event is hidden and submitter is notified with feedback
4. **Given** I submit events that get approved, **When** approvals occur, **Then** my reputation score increases
5. **Given** I am moderator, **When** I approve an event, **Then** it publishes immediately regardless of other votes

---

### User Story 6 - Custom Saved Filters (Priority: P3)

Authenticated users can save their frequently used filter combinations with custom names. Saved filters appear in a dropdown for quick access, allowing users to instantly apply complex filter sets (e.g., "Oslo Tech Events Weekends").

**Why this priority**: Power user feature that improves experience for engaged users. Less critical than basic filtering (P1) but adds significant value for returning users.

**Independent Test**: Can be tested by creating filter combination, saving it, logging out and back in, then loading the saved filter. Success criteria: Filters persist across sessions and apply correctly.

**Acceptance Scenarios**:

1. **Given** I have applied multiple filters, **When** I click "Save Filter" and provide name, **Then** filter combination is saved to my account
2. **Given** I have saved filters, **When** I open saved filters dropdown, **Then** I see list of my named filter presets
3. **Given** I select a saved filter, **When** it loads, **Then** all associated filter criteria are applied to event view
4. **Given** I want to update saved filter, **When** I modify criteria and click "Update", **Then** saved filter is updated with new criteria
5. **Given** I have saved filter, **When** I click delete icon, **Then** I see confirmation dialog before permanent deletion

---

### User Story 7 - AI-Generated Event Images (Priority: P3)

For events without images or with low-quality images, the system uses OpenAI's DALL-E to generate themed cover images based on event description, type, and evHenter's design system. Generated images follow a consistent visual style with brand colors and aesthetic.

**Why this priority**: Improves visual consistency and user experience, but not critical for MVP. Events can function with placeholder images or original images initially.

**Independent Test**: Can be tested by submitting event without image and verifying AI-generated image appears within 30 seconds. Success criteria: 90% of generated images are contextually appropriate and on-brand.

**Acceptance Scenarios**:

1. **Given** event is submitted without image, **When** event is approved, **Then** system generates themed cover image using OpenAI
2. **Given** AI image is being generated, **When** user views event, **Then** placeholder image shows with generation status
3. **Given** generated image is ready, **When** event detail page loads, **Then** AI image displays with consistent evHenter styling
4. **Given** user dislikes generated image, **When** user has edit permissions, **Then** user can regenerate or upload custom image
5. **Given** AI image generation fails, **When** error occurs, **Then** system falls back to themed default placeholder

---

### User Story 8 - User Authentication & Profiles (Priority: P2)

Users can create accounts, login, and manage their profiles. Authentication enables event submission, saved filters, reputation tracking, and approval participation. Profiles display user reputation, submitted events, and contribution history.

**Why this priority**: Required for all community features (P2-P3), but browsing (P1) can work anonymously. Should be implemented early to enable contributions.

**Independent Test**: Can be tested by creating account, logging in/out, and verifying authentication state persists. Success criteria: Users can register, authenticate, and access protected features.

**Acceptance Scenarios**:

1. **Given** I am new user, **When** I click "Sign Up", **Then** I can create account with email/password or OAuth
2. **Given** I have account, **When** I enter credentials and login, **Then** I am authenticated and redirected to main view
3. **Given** I am authenticated, **When** I view my profile, **Then** I see reputation score, submitted events, and approval history
4. **Given** I am authenticated, **When** session expires, **Then** I am prompted to re-authenticate before protected actions
5. **Given** I forgot password, **When** I request reset, **Then** I receive email with secure reset link

---

### Edge Cases

- **What happens when two users submit identical events?** System should detect duplicates using fuzzy matching on title + date + location, and prompt user to approve existing submission instead of creating duplicate
- **How does system handle malicious event submissions (spam, inappropriate content)?** Implement content moderation rules, rate limiting (max 5 submissions per hour), and automated flagging for review
- **What if OpenAI parsing extracts incorrect information?** All parsed data is editable before submission, and users can report issues to improve parsing prompts
- **How does system handle events that get cancelled or rescheduled?** Event submitters and moderators can mark events as "cancelled" or update details. Cancelled events remain in system but marked clearly
- **What happens when filter combination returns 1000+ events?** Implement pagination (24 events per page) and sorting options (date, popularity, distance)
- **How to prevent approval system gaming (users creating multiple accounts)?** Require email verification, implement rate limiting, and use device fingerprinting to detect suspicious patterns
- **What if event URL becomes invalid after parsing?** System should validate URLs periodically and flag broken links for review
- **How does system handle international events (timezones, languages)?** Store all dates in UTC, display in user's timezone, support i18n for interface
- **What happens if AI image generation is slow or expensive?** Queue image generation as background job, set monthly budget limits, use cached generations for similar event types
- **How to handle GDPR compliance for user data?** Implement data export, deletion requests, and clear consent mechanisms for data collection

## Requirements

### Functional Requirements

#### Core Discovery & Filtering
- **FR-001**: System MUST display events as cards in grid layout showing title, date, location, type, and thumbnail image
- **FR-002**: System MUST support filtering events by city/location with autocomplete dropdown
- **FR-003**: System MUST support filtering events by date range with calendar picker
- **FR-004**: System MUST support filtering events by event type (conference, concert, workshop, sports, social, etc.)
- **FR-005**: System MUST apply filters in real-time without page reload
- **FR-006**: System MUST show filter count badges indicating number of active filters
- **FR-007**: System MUST provide "Clear All Filters" functionality
- **FR-008**: System MUST display empty state with helpful suggestions when no events match filters
- **FR-009**: System MUST paginate event results with 24 events per page
- **FR-010**: System MUST support sorting events by date (ascending/descending), popularity, and proximity

#### Event Details
- **FR-011**: Each event MUST have detail page with full description, cover image, date/time, location, event type, and original URL
- **FR-012**: Event detail page MUST display original event landing page URL as prominent call-to-action button
- **FR-013**: Event URLs MUST open in new browser tab
- **FR-014**: System MUST preserve user's filter state when navigating back from event details
- **FR-015**: Event detail pages MUST be shareable via unique URLs

#### Event Submission
- **FR-016**: Authenticated users MUST be able to submit events manually via form
- **FR-017**: Event submission form MUST validate required fields: title, description, location, city, date/time, event type
- **FR-018**: System MUST support optional event image upload (max 5MB, formats: JPG, PNG, WebP)
- **FR-019**: System MUST validate event dates are in future (unless explicitly marked as recurring)
- **FR-020**: Submitted events MUST enter "pending" status until approved
- **FR-021**: Users MUST be able to view status of their submitted events
- **FR-022**: Users MUST be able to edit their pending events before approval

#### AI URL Parsing
- **FR-023**: System MUST accept event URL and extract information using OpenAI API
- **FR-024**: URL parser MUST extract at minimum: title, date, location, description
- **FR-025**: URL parser SHOULD attempt to extract: event type, image URL, organizer info
- **FR-026**: Parsed data MUST pre-fill event submission form for user review
- **FR-027**: Users MUST be able to edit all parsed fields before submission
- **FR-028**: System MUST handle parsing failures gracefully with fallback to manual entry
- **FR-029**: System MUST validate extracted URLs are accessible before saving
- **FR-030**: System MUST store original URL with event for attribution

#### Community Approval
- **FR-031**: Events MUST require approval before appearing in public view
- **FR-032**: Users with reputation ≥ 50 MUST be able to approve/reject pending events
- **FR-033**: Moderators and admins MUST be able to approve events immediately (skip community threshold)
- **FR-034**: Events MUST require 3 approvals from qualified users OR 1 moderator approval
- **FR-035**: Events receiving 5 rejections MUST be automatically hidden
- **FR-036**: Approvers MUST be able to provide optional feedback comments
- **FR-037**: Event submitters MUST be notified when their event is approved or rejected
- **FR-038**: System MUST prevent users from approving their own submissions
- **FR-039**: System MUST track user reputation based on approval/rejection ratio
- **FR-040**: Users with consistently rejected submissions MUST have submission privileges reviewed

#### Saved Filters
- **FR-041**: Authenticated users MUST be able to save current filter combination with custom name
- **FR-042**: System MUST persist saved filters across sessions
- **FR-043**: Users MUST be able to view list of their saved filters
- **FR-044**: Users MUST be able to load saved filter with single click
- **FR-045**: Users MUST be able to update existing saved filters
- **FR-046**: Users MUST be able to delete saved filters with confirmation
- **FR-047**: System MUST limit users to 20 saved filters maximum
- **FR-048**: Saved filters MUST be private to owning user

#### AI Image Generation
- **FR-049**: System MUST generate themed cover image for events without images using OpenAI DALL-E
- **FR-050**: Generated images MUST follow evHenter design system (colors, style, aesthetics)
- **FR-051**: Image generation MUST use event description, type, and location as context
- **FR-052**: System MUST queue image generation as background job (non-blocking)
- **FR-053**: System MUST display placeholder during image generation
- **FR-054**: Users with edit permissions MUST be able to regenerate AI images
- **FR-055**: System MUST cache and reuse similar generated images to reduce costs
- **FR-056**: System MUST fallback to default themed placeholder if generation fails
- **FR-057**: Generated images MUST be optimized for web (WebP format, responsive sizes)

#### Authentication & User Management
- **FR-058**: System MUST support email/password authentication
- **FR-059**: System SHOULD support OAuth authentication (Google, GitHub)
- **FR-060**: System MUST require email verification before account activation
- **FR-061**: System MUST support password reset via email
- **FR-062**: Users MUST be able to view and edit their profile information
- **FR-063**: User profiles MUST display reputation score, submission count, and approval history
- **FR-064**: System MUST assign role-based permissions (user, moderator, admin)
- **FR-065**: System MUST implement rate limiting on event submissions (5 per hour per user)

#### Performance & UX
- **FR-066**: Main event view MUST load within 2 seconds on 3G connection
- **FR-067**: Filter application MUST provide visual feedback within 100ms
- **FR-068**: System MUST implement image lazy loading for event cards
- **FR-069**: System MUST implement optimistic UI updates for filter changes
- **FR-070**: System MUST support keyboard navigation for all interactive elements
- **FR-071**: System MUST be fully responsive (mobile, tablet, desktop)
- **FR-072**: System MUST implement infinite scroll or pagination for event lists
- **FR-073**: System MUST cache filter results for 5 minutes to reduce database load

#### Data & Integration
- **FR-074**: System MUST store all event dates/times in UTC with timezone metadata
- **FR-075**: System MUST display dates/times in user's local timezone
- **FR-076**: System MUST validate location data using geocoding API
- **FR-077**: System MUST support event search by keyword (title, description, organizer)
- **FR-078**: System MUST track event view counts for popularity sorting
- **FR-079**: System MUST support event categories/tags for improved filtering
- **FR-080**: System MUST maintain audit log of event approvals/rejections

### Key Entities

#### **Event**
Core entity representing a community event. Attributes include:
- Identification: Unique ID, slug for URLs
- Basic Info: Title, description (short/long), event type/category
- Temporal: Start date/time, end date/time, timezone, created/updated timestamps
- Location: City, venue name, full address, coordinates (lat/lng)
- Media: Cover image URL/path, AI-generated flag, image generation status
- Source: Original event URL, submitter user ID
- Status: Approval status (pending/approved/rejected), visibility (public/hidden)
- Metrics: View count, favorite count, approval/rejection count
- Relationships: Belongs to User (submitter), has many Approvals, has many Tags

#### **User**
Represents authenticated platform user. Attributes include:
- Identity: Unique ID, email, hashed password, name, avatar
- Roles: Role enum (user/moderator/admin)
- Reputation: Reputation score (calculated), verified flag
- Dates: Created at, last login, email verified timestamp
- Relationships: Has many Events (submitted), has many SavedFilters, has many Approvals

#### **Approval**
Represents a community approval/rejection vote on pending event. Attributes include:
- References: Event ID (FK), User ID (FK)
- Vote: Vote type (approve/reject), optional feedback comment
- Metadata: Created timestamp, vote weight (based on user reputation)
- Relationships: Belongs to Event, belongs to User

#### **SavedFilter**
Represents user's saved filter combination. Attributes include:
- Identification: Unique ID, user ID (FK)
- Configuration: Filter name (user-defined), filter criteria (JSON)
- Metadata: Created timestamp, last used timestamp, use count
- Relationships: Belongs to User

#### **Tag/Category**
Represents event categorization. Attributes include:
- Identification: Unique ID, name, slug
- Metadata: Description, color code, icon identifier
- Hierarchy: Parent tag ID (for nested categories), sort order
- Relationships: Many-to-many with Events

#### **Location**
Represents geographic location for filtering. Attributes include:
- Identification: Unique ID, city name, country, region
- Geography: Coordinates (lat/lng), timezone
- Metadata: Population, featured flag (for suggested locations)
- Relationships: Has many Events

#### **ImageGeneration**
Tracks AI image generation jobs. Attributes include:
- References: Event ID (FK), user ID (FK)
- Generation: Prompt used, DALL-E model version, generation status
- Result: Generated image URL, cost, generation time
- Metadata: Created timestamp, completed timestamp, retry count
- Relationships: Belongs to Event

## Success Criteria

### Measurable Outcomes

#### User Engagement
- **SC-001**: Users can find relevant events using filters in under 30 seconds (measured via user testing)
- **SC-002**: 70% of users who visit event detail page click through to original event URL
- **SC-003**: 90% of first-time users successfully apply at least one filter on initial visit
- **SC-004**: Authenticated users submit average of 2+ events per month after joining
- **SC-005**: 60% of submitted events receive approval within 24 hours

#### Platform Performance
- **SC-006**: Main event view loads in under 2 seconds for 95th percentile of users
- **SC-007**: Filter application provides results within 500ms for 99% of queries
- **SC-008**: System handles 1000+ concurrent users without performance degradation
- **SC-009**: AI URL parsing successfully extracts ≥70% of event data fields
- **SC-010**: AI image generation completes within 30 seconds for 90% of requests

#### Data Quality
- **SC-011**: 95% of approved events have complete information (all required fields filled)
- **SC-012**: Less than 5% of approved events are later reported as spam/invalid
- **SC-013**: AI-generated images are rated as "appropriate and on-brand" by users 85% of time
- **SC-014**: Duplicate event submissions represent less than 10% of total submissions

#### Business Metrics
- **SC-015**: Platform grows to 500+ active events within first 3 months
- **SC-016**: User retention rate of 40%+ (users who return within 30 days)
- **SC-017**: 25% of anonymous users create accounts to access community features
- **SC-018**: Saved filter feature used by 50%+ of authenticated users
- **SC-019**: Cost per AI operation (parsing + image generation) remains under $0.10 per event

#### Accessibility & Usability
- **SC-020**: Platform achieves WCAG 2.1 AA compliance (verified via automated testing)
- **SC-021**: Mobile users represent 60%+ of traffic with equivalent task success rates
- **SC-022**: Keyboard-only users can complete all core tasks without mouse
- **SC-023**: User satisfaction score (via survey) averages 4.0+ out of 5.0
- **SC-024**: Support ticket volume related to event submission stays under 5% of total submissions

## Technical Considerations

### Architecture

**Frontend**: Next.js 16 with React Server Components
- Leverage existing Timeline component architecture for event visualization
- Reuse existing modal patterns for event submission forms
- Extend authentication system for community features

**Backend**: Next.js API routes with middleware composition
- Reuse existing `withAuth`, `withValidation`, `withErrorHandling` middleware
- Implement new `withRateLimit` middleware for submission protection
- Queue-based architecture for AI operations (parsing, image generation)

**Database**: PostgreSQL with Drizzle ORM
- Extend existing schema with new event-related tables
- Implement full-text search indexes on event title/description
- Use PostGIS extension for geographic queries and proximity filtering

**External Services**:
- OpenAI API for URL parsing and DALL-E image generation
- Geocoding API (Google Maps or Mapbox) for location validation
- Background job queue (BullMQ or similar) for async AI operations
- CDN (Vercel Edge Network) for image optimization and delivery

### Data Model

```typescript
// Core Event Schema (Drizzle)
events: {
  id: uuid (PK)
  organizationId: uuid (FK) // Multi-tenancy support
  slug: varchar(200) UNIQUE
  title: varchar(300) NOT NULL
  shortDescription: varchar(500)
  longDescription: text
  eventType: enum['conference', 'concert', 'workshop', 'sports', 'social', 'networking', 'other']

  startDateTime: timestamp NOT NULL
  endDateTime: timestamp NOT NULL
  timezone: varchar(50)

  city: varchar(100) NOT NULL
  venueName: varchar(200)
  fullAddress: text
  latitude: decimal(10, 8)
  longitude: decimal(11, 8)

  coverImageUrl: varchar(500)
  isAiGenerated: boolean DEFAULT false
  imageGenerationStatus: enum['pending', 'generating', 'completed', 'failed']

  originalEventUrl: varchar(1000)
  submittedBy: uuid (FK → users)

  approvalStatus: enum['pending', 'approved', 'rejected', 'cancelled']
  visibility: enum['public', 'hidden', 'deleted']

  viewCount: integer DEFAULT 0
  approvalCount: integer DEFAULT 0
  rejectionCount: integer DEFAULT 0

  createdAt: timestamp
  updatedAt: timestamp
  approvedAt: timestamp
}

// Approval/Voting Schema
approvals: {
  id: uuid (PK)
  eventId: uuid (FK → events) NOT NULL
  userId: uuid (FK → users) NOT NULL
  voteType: enum['approve', 'reject']
  feedbackComment: text
  voteWeight: decimal(3, 2) DEFAULT 1.0
  createdAt: timestamp

  UNIQUE(eventId, userId) // One vote per user per event
}

// Saved Filters Schema
savedFilters: {
  id: uuid (PK)
  userId: uuid (FK → users) NOT NULL
  filterName: varchar(100) NOT NULL
  filterCriteria: jsonb NOT NULL // Stores filter state
  useCount: integer DEFAULT 0
  lastUsedAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}

// Location/City Schema (for filtering)
locations: {
  id: uuid (PK)
  cityName: varchar(100) NOT NULL
  country: varchar(100) NOT NULL
  region: varchar(100)
  latitude: decimal(10, 8)
  longitude: decimal(11, 8)
  timezone: varchar(50)
  isFeatured: boolean DEFAULT false
  eventCount: integer DEFAULT 0 // Denormalized for performance
}

// Event Tags (many-to-many)
tags: {
  id: uuid (PK)
  name: varchar(50) UNIQUE NOT NULL
  slug: varchar(50) UNIQUE
  description: text
  colorCode: varchar(7)
  parentTagId: uuid (FK → tags, nullable)
  sortOrder: integer
}

eventTags: {
  eventId: uuid (FK → events)
  tagId: uuid (FK → tags)
  PRIMARY KEY (eventId, tagId)
}

// AI Image Generation Tracking
imageGenerations: {
  id: uuid (PK)
  eventId: uuid (FK → events)
  requestedBy: uuid (FK → users)
  prompt: text NOT NULL
  modelVersion: varchar(50)
  status: enum['queued', 'processing', 'completed', 'failed']
  resultImageUrl: varchar(500)
  costUsd: decimal(6, 4)
  generationTimeMs: integer
  errorMessage: text
  retryCount: integer DEFAULT 0
  createdAt: timestamp
  completedAt: timestamp
}

// User Reputation Extended
users: {
  // ... existing fields ...
  reputationScore: integer DEFAULT 0
  eventsSubmitted: integer DEFAULT 0
  eventsApproved: integer DEFAULT 0
  eventsRejected: integer DEFAULT 0
  approvalsGiven: integer DEFAULT 0
  canApprove: boolean GENERATED // Computed: reputationScore >= 50
  isVerified: boolean DEFAULT false
  submissionRateLimit: integer DEFAULT 5 // Per hour
}
```

### API Endpoints

```
# Public (No Auth)
GET    /api/events                 # List events with filtering
GET    /api/events/:id             # Get event details
GET    /api/locations              # Get cities for filter dropdown
GET    /api/tags                   # Get event types/categories

# Authenticated
POST   /api/events                 # Submit new event
PATCH  /api/events/:id             # Update event (own events only)
POST   /api/events/parse-url       # Parse event from URL (OpenAI)
POST   /api/events/:id/approve     # Approve event (requires reputation)
POST   /api/events/:id/reject      # Reject event (requires reputation)

GET    /api/filters                # Get user's saved filters
POST   /api/filters                # Create saved filter
PATCH  /api/filters/:id            # Update saved filter
DELETE /api/filters/:id            # Delete saved filter

POST   /api/images/generate        # Trigger AI image generation
GET    /api/images/status/:jobId   # Check generation status

GET    /api/users/me               # Get current user profile
PATCH  /api/users/me               # Update profile
GET    /api/users/me/events        # Get user's submitted events
GET    /api/users/me/reputation    # Get reputation details

# Moderator/Admin
GET    /api/moderation/queue       # Get pending events
POST   /api/moderation/bulk-approve # Bulk approve events
GET    /api/moderation/reports     # Get reported events
```

### OpenAI Integration

**URL Parsing Prompt Template**:
```
You are an event information extractor. Analyze the provided webpage content and extract structured event information.

Webpage URL: {url}
Webpage Content: {html_content}

Extract the following information in JSON format:
{
  "title": "event title",
  "description": "detailed description",
  "startDateTime": "ISO 8601 datetime",
  "endDateTime": "ISO 8601 datetime or null",
  "city": "city name",
  "venueName": "venue name or null",
  "fullAddress": "complete address or null",
  "eventType": "conference|concert|workshop|sports|social|networking|other",
  "imageUrl": "event image URL or null",
  "organizerInfo": "organizer name/info or null"
}

Rules:
- Extract only factual information from the page
- Use ISO 8601 format for dates (YYYY-MM-DDTHH:mm:ss)
- If information is missing, use null
- Infer eventType based on content keywords
- Return only valid JSON, no additional commentary
```

**Image Generation Prompt Template**:
```
Create a vibrant, modern event cover image for: "{event_title}"

Event Details:
- Type: {event_type}
- Location: {city}
- Description: {short_description}

Style Requirements:
- Design aesthetic: Modern, clean, minimalist
- Color palette: {evHenter_brand_colors}
- No text or typography in image
- Focus on abstract or iconic representation
- Suitable for web display (16:9 aspect ratio)
- Professional and inviting atmosphere

Generate a visually appealing cover image that captures the essence of this event while matching the evHenter brand style.
```

### Security & Privacy

- **Input Validation**: Sanitize all user inputs, especially URLs and HTML content from parsing
- **Rate Limiting**: Strict limits on event submission, API calls, and OpenAI operations
- **Content Moderation**: Automated flagging of inappropriate content using keyword filters
- **GDPR Compliance**: User data export, deletion, and consent mechanisms
- **Authentication**: Secure JWT sessions with refresh token rotation
- **Authorization**: Role-based access control for moderation features
- **Cost Controls**: Daily budget caps on OpenAI API usage, queue prioritization

### Performance Optimization

- **Caching Strategy**:
  - Redis cache for filter results (5 min TTL)
  - CDN caching for event images (1 year TTL)
  - Browser caching for static assets
- **Database Optimization**:
  - Indexes on: city, eventType, startDateTime, approvalStatus
  - Full-text search index on title + description
  - Geographic indexes (PostGIS) for proximity queries
- **Image Optimization**:
  - Generate responsive WebP variants (thumbnail, medium, full)
  - Lazy loading with blur placeholder
  - CDN delivery with automatic format selection
- **Background Jobs**:
  - Queue AI operations (parsing, image generation)
  - Batch reputation score calculations
  - Periodic cache warming for popular filters

### Testing Strategy

- **Unit Tests**: All business logic, validation functions, utility helpers
- **Integration Tests**: API endpoints, database operations, OpenAI integration
- **E2E Tests**: Critical user journeys (browse → filter → view → submit → approve)
- **Accessibility Tests**: WCAG 2.1 AA compliance via axe-playwright
- **Performance Tests**: Load testing for concurrent users, filter performance
- **AI Quality Tests**: Parsing accuracy evaluation on sample event URLs

## Implementation Phases

### Phase 1: MVP Foundation (P1 - Weeks 1-3)
- Event database schema and API
- Main event list view with cards
- Basic filtering (city, date, type)
- Event detail pages
- Public read-only experience

### Phase 2: Community Contributions (P2 - Weeks 4-6)
- User authentication and profiles
- Manual event submission form
- Pending event queue
- Basic approval system (moderator-only initially)

### Phase 3: AI Integration (P2-P3 - Weeks 7-9)
- OpenAI URL parsing
- Background job queue
- AI image generation
- Cost monitoring and controls

### Phase 4: Community Features (P3 - Weeks 10-12)
- Full community approval system
- Reputation scoring
- Saved filters
- User profiles and history

### Phase 5: Polish & Scale (Ongoing)
- Performance optimization
- Advanced filtering (proximity, tags)
- Mobile app considerations
- Analytics and insights

## Open Questions & Decisions Needed

1. **Authentication Method**: Email/password only or include OAuth providers (Google, GitHub)?
2. **Event Moderation**: Start with moderator-only approval or enable community approval from launch?
3. **Geographic Scope**: Launch globally or focus on specific regions/countries initially?
4. **OpenAI Model Selection**: GPT-4 for parsing (higher accuracy, higher cost) or GPT-3.5 (faster, cheaper)?
5. **Image Generation**: DALL-E 3 (higher quality) or DALL-E 2 (lower cost)?
6. **Duplicate Detection**: Automatic prevention or allow duplicates with user reporting?
7. **Monetization**: Free platform with usage limits or subscription tiers for power users?
8. **Recurring Events**: Support recurring event series or single occurrences only?
9. **Event Updates**: Allow updates to approved events or require re-approval?
10. **Data Retention**: Archive past events immediately or keep for historical browsing?

---

**Next Steps**:
1. Review specification with stakeholders
2. Clarify open questions and decisions
3. Create detailed task breakdown for Phase 1
4. Set up development environment and dependencies
5. Begin database schema implementation
