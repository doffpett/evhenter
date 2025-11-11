# evHenter - Community Event Discovery Platform

> A community-driven event discovery platform where users can browse, filter, and discover local events with AI-powered features.

## 🎯 Project Overview

evHenter helps users discover and organize events through an intuitive web platform featuring:

- 🔍 **Smart Event Discovery** - Browse and filter events by location, date, and type
- 🤖 **AI-Powered Parsing** - Automatically extract event details from URLs using OpenAI
- 🎨 **AI-Generated Images** - Create themed cover images with DALL-E
- 👥 **Community Contributions** - Users can submit events with community approval
- 💾 **Custom Filters** - Save frequently used filter combinations
- 📱 **Mobile-First** - Responsive design that works on all devices

## 🏗️ Architecture

**Technology Stack:**
- **Frontend**: Vanilla HTML, CSS, JavaScript (ES6+)
- **Backend**: Node.js serverless functions (Vercel)
- **Database**: PostgreSQL (Vercel Postgres)
- **Storage**: Vercel Blob Storage
- **AI**: OpenAI (GPT-4 for parsing, DALL-E 3 for images)
- **Analytics**: Vercel Analytics (Web Vitals + Custom Events)
- **Hosting**: Vercel
- **Source Control**: GitHub

## 📁 Project Structure

```
evHenter/
├── api/                    # Vercel serverless functions
│   ├── events/             # Event management endpoints
│   ├── auth/               # Authentication endpoints
│   ├── approvals/          # Community approval system
│   ├── filters/            # Saved filters
│   └── images/             # AI image generation
├── public/                 # Static frontend assets
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript modules
│   │   ├── components/     # UI components
│   │   ├── services/       # API client layer
│   │   └── pages/          # Page-specific logic
│   └── *.html              # HTML page templates
├── lib/                    # Shared backend utilities
│   ├── db/                 # Database queries and schema
│   ├── middleware/         # Auth, validation, rate limiting
│   ├── services/           # External service integrations
│   └── models/             # Data models
├── tests/                  # Test suites
└── specs/                  # Project specifications
    └── 002-event-management/
        ├── plan.md                    # Implementation plan
        ├── research.md                # Technology research (TBD)
        ├── data-model.md              # Database schema (TBD)
        └── api-contracts.md           # API specifications (TBD)
```

## 📋 Implementation Phases

### Phase 1: MVP Foundation (Weeks 2-3)
Browse and filter events with responsive UI

### Phase 2: Authentication & Submission (Weeks 4-5)
User accounts and manual event submission

### Phase 3: AI Integration (Weeks 6-7)
OpenAI URL parsing and image generation

### Phase 4: Community Features (Weeks 8-10)
Approval system, reputation, saved filters

### Phase 5: Polish & Launch (Weeks 11-12)
PWA, optimization, production deployment

## 📚 Documentation

- **[Constitution](.specify/memory/constitution.md)** - Project principles and standards
- **[Specification](.specify/memory/spec-event-management.md)** - Detailed feature requirements
- **[Implementation Plan](specs/002-event-management/plan.md)** - Technical roadmap and architecture

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (local development)
- OpenAI API key
- Vercel account

### Setup (Coming Soon)

Detailed setup instructions will be available in `specs/002-event-management/quickstart.md` after Phase 0 completion.

```bash
# Clone repository
git clone https://github.com/doffpett/evhenter.git
cd evhenter

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint
```

## 📊 Project Status

**Current Phase**: Phase 1 - Event Management System ✅ COMPLETE
**Branch**: `main`
**Status**: 🎉 **LIVE IN PRODUCTION** 🎉

**🌐 Live URLs:**
- **Production**: https://evhenter.ai
- **Events List**: https://evhenter.ai/events.html
- **API Events**: https://evhenter.ai/api/events
- **API Health**: https://evhenter.ai/api/health
- **Vercel Dashboard**: https://vercel.com/doffpetts-projects/evhenter

### Phase 0 - Setup & Deployment ✅ COMPLETE
- ✅ Project specification
- ✅ Implementation plan
- ✅ Constitution and coding standards
- ✅ Git repository initialization
- ✅ Vercel project structure
- ✅ Analytics integration
- ✅ API health endpoint
- ✅ Local development server
- ✅ Deployment documentation
- ✅ Production deployment to Vercel
- ✅ Domain configured (evhenter.ai)
- ✅ SSL certificate active
- ✅ Database connected

### Phase 1 - Event Management System ✅ COMPLETE
- ✅ Database schema design (events, event_types, locations)
- ✅ Full-text search with Norwegian language support
- ✅ Auto-generated slugs for SEO-friendly URLs
- ✅ Database setup script with seed data
- ✅ Connection pooling and query helpers
- ✅ GET /api/events endpoint (with filters, pagination, search)
- ✅ GET /api/events/:id endpoint (by UUID or slug)
- ✅ Event browsing page (public/events.html)
- ✅ Responsive event cards with filters
- ✅ Event detail page (public/event-detail.html)
- ✅ Clean URL routing (/event/{slug})
- ✅ Social sharing functionality
- ✅ 6 test events seeded (Oslo, Bergen, Trondheim, Stavanger)
- ✅ Mobile-first responsive design
- ✅ All endpoints deployed and verified

### Upcoming
- ⏳ Phase 2: Authentication & User Management

## 📝 Contributing

This project follows strict quality standards defined in the [Constitution](.specify/memory/constitution.md):

- TypeScript/JSDoc type annotations required
- 80% minimum test coverage
- WCAG 2.1 AA accessibility compliance
- Mobile-first responsive design
- TDD approach for critical features

## 📄 License

[License TBD]

## 🤝 Team

**Project Owner**: [@doffpett](https://github.com/doffpett)

---

**Built with vanilla JavaScript, powered by OpenAI, hosted on Vercel**
