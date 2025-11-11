# Local Development Guide - evHenter

This guide walks you through setting up evHenter for local development and deploying to Vercel.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Vercel CLI** (for local dev server)
- **Git** (already installed)
- **Vercel Account** ([Sign up](https://vercel.com/signup))

## Quick Start

### 1. Install Dependencies

```bash
cd evHenter
npm install
```

This installs:
- `openai` - AI integration
- `pg` - PostgreSQL client
- `jose` - JWT authentication
- `bcryptjs` - Password hashing
- `vercel` - Vercel CLI (dev server)
- `@playwright/test` - E2E testing

### 2. Install Vercel CLI Globally (Optional)

```bash
npm install -g vercel
```

Or use via npx: `npx vercel dev`

### 3. Set Up Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see below for getting these).

### 4. Start Local Development Server

```bash
npm run dev
```

Or:
```bash
vercel dev
```

The app will be available at: **http://localhost:3000**

### 5. Test the Setup

Open your browser and visit:
- **Homepage**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

You should see the evHenter welcome page with API status indicators.

---

## Setting Up Vercel Postgres (Database)

### Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `doffpett/evhenter`
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `public`
5. Click **"Deploy"** (it will fail initially - that's okay!)

### Step 2: Create Postgres Database

1. In Vercel Dashboard, go to your project
2. Navigate to **Storage** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Choose a region close to your users (e.g., `iad1` for US East)
6. Name it: `evhenter-db`
7. Click **"Create"**

### Step 3: Get Database Credentials

1. In the database page, click **".env.local"** tab
2. Copy all the `POSTGRES_*` environment variables
3. Paste them into your local `.env.local` file

Example:
```bash
POSTGRES_URL="postgres://default:password@host.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:password@host.vercel-storage.com:5432/verceldb?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://default:password@host.vercel-storage.com:5432/verceldb"
POSTGRES_USER="default"
POSTGRES_HOST="host.vercel-storage.com"
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="verceldb"
```

### Step 4: Link Vercel Project Locally

```bash
vercel link
```

Follow the prompts:
- **Set up and deploy**: No (we already deployed)
- **Link to existing project**: Yes
- Select your project: `evhenter`
- **Link to it**: Yes

This creates a `.vercel` folder with project configuration.

---

## Setting Up OpenAI API

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Name it: `evHenter Development`
4. Copy the key (starts with `sk-...`)
5. Add to `.env.local`:

```bash
OPENAI_API_KEY="sk-..."
OPENAI_PARSING_MODEL="gpt-4-turbo-preview"
OPENAI_IMAGE_MODEL="dall-e-3"
```

**Note**: OpenAI API requires payment setup. You'll need to add a credit card and set usage limits.

---

## Setting Up Vercel Blob Storage (Images)

1. In Vercel Dashboard, go to your project
2. Navigate to **Storage** tab
3. Click **"Create Database"**
4. Select **"Blob"**
5. Click **"Create"**
6. Copy the `BLOB_READ_WRITE_TOKEN`
7. Add to `.env.local`:

```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

---

## Complete .env.local Example

```bash
# Database (from Vercel Postgres)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://...?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="xxx.vercel-storage.com"
POSTGRES_PASSWORD="xxx"
POSTGRES_DATABASE="verceldb"

# Authentication (generate your own)
JWT_SECRET="your-super-secret-jwt-key-change-this-to-something-random"
JWT_EXPIRES_IN="7d"
COOKIE_DOMAIN="localhost"
COOKIE_SECURE="false"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_PARSING_MODEL="gpt-4-turbo-preview"
OPENAI_IMAGE_MODEL="dall-e-3"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Feature Flags
ENABLE_AI_PARSING="true"
ENABLE_AI_IMAGES="true"
ENABLE_COMMUNITY_APPROVAL="false"

# Application
NODE_ENV="development"
APP_URL="http://localhost:3000"
EVENTS_PER_PAGE="24"

# Development
DEV_SKIP_AUTH="false"
DEBUG="true"
MOCK_OPENAI="false"
```

---

## Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and use it as `JWT_SECRET` in `.env.local`.

---

## Running the Development Server

Once everything is configured:

```bash
# Start Vercel dev server
npm run dev

# Or
vercel dev
```

The server will:
- Serve static files from `public/`
- Run API functions from `api/`
- Hot-reload on file changes
- Use your `.env.local` variables

**Access points**:
- Frontend: http://localhost:3000
- API Health: http://localhost:3000/api/health
- API Docs: Coming in Phase 1

---

## Testing the Setup

### 1. Check API Health

Visit http://localhost:3000/api/health

You should see:
```json
{
  "status": "healthy",
  "environment": "development",
  "version": "0.1.0",
  "services": {
    "api": "operational",
    "database": "configured",
    "openai": "configured",
    "storage": "configured"
  }
}
```

### 2. Check Frontend

Visit http://localhost:3000

You should see the evHenter welcome page with a green status indicator showing API is healthy.

### 3. Test Database Connection (Coming Soon)

Once we create the database schema:
```bash
npm run db:setup
npm run db:seed
```

---

## Deploying to Vercel

### Deploy to Production

```bash
# Deploy to production (evhenter.ai)
npm run vercel:deploy

# Or
vercel --prod
```

### Deploy Preview (Staging)

```bash
# Deploy preview (gets unique URL)
npm run vercel:preview

# Or
vercel
```

### Automatic Deployments

Once linked to GitHub:
- **Push to `main`**: Deploys to production (`evhenter.ai`)
- **Push to other branches**: Creates preview deployment
- **Pull requests**: Creates preview deployment with unique URL

---

## Configure Custom Domain (evHenter.ai)

### Step 1: Add Domain to Vercel

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Domains**
3. Add domain: `evhenter.ai`
4. Add subdomain: `www.evhenter.ai` (redirect to evhenter.ai)

### Step 2: Update DNS

Go to your domain registrar (where you bought evhenter.ai) and add these DNS records:

**For evhenter.ai:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For www.evhenter.ai:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Verification:**
Vercel will also provide a TXT record for verification. Add it temporarily.

### Step 3: Wait for DNS Propagation

- DNS changes can take 24-48 hours
- Vercel will automatically provision SSL certificate (Let's Encrypt)
- Once active, `evhenter.ai` will point to your Vercel deployment

---

## Project Structure

```
evHenter/
├── api/                    # Vercel serverless functions
│   ├── events/             # Event endpoints (coming soon)
│   ├── auth/               # Auth endpoints (Phase 2)
│   └── health.js           # Health check ✅
├── public/                 # Static frontend
│   ├── index.html          # Homepage ✅
│   ├── css/                # Stylesheets (coming soon)
│   └── js/                 # JavaScript (coming soon)
├── lib/                    # Shared backend code
│   ├── db/                 # Database (coming soon)
│   └── utils/              # Utilities (coming soon)
├── docs/                   # Documentation
│   ├── local-development.md  # This file ✅
│   └── mcp-setup.md        # MCP server setup ✅
├── specs/                  # Specifications
│   └── 002-event-management/
│       ├── plan.md         # Implementation plan ✅
│       ├── tasks.md        # Task breakdown ✅
│       └── decisions.md    # Technical decisions ✅
├── .env.example            # Environment template ✅
├── .env.local              # Your local config (gitignored)
├── package.json            # Dependencies ✅
├── vercel.json             # Vercel config ✅
└── README.md               # Project overview ✅
```

---

## Common Commands

```bash
# Development
npm run dev              # Start local server
npm run build            # Build for production
npm run lint             # Check code style
npm run lint:fix         # Fix code style issues
npm run format           # Format with Prettier

# Testing (coming soon)
npm test                 # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e         # Run E2E tests
npm run test:watch       # Run tests in watch mode

# Database (coming soon)
npm run db:setup         # Create database schema
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data

# Deployment
npm run vercel:preview   # Deploy preview
npm run vercel:deploy    # Deploy to production
vercel logs              # View deployment logs
```

---

## Troubleshooting

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
Kill the process using port 3000:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: "Database connection failed"
- Verify `POSTGRES_URL` in `.env.local`
- Check Vercel dashboard → Storage → Postgres is running
- Try non-pooling URL: `POSTGRES_URL_NON_POOLING`

### Error: "OpenAI API key invalid"
- Verify key starts with `sk-`
- Check OpenAI dashboard for key status
- Ensure billing is set up

### Vercel CLI not working
```bash
# Reinstall Vercel CLI
npm uninstall -g vercel
npm install -g vercel

# Or use via npx
npx vercel dev
```

---

## Next Steps

Now that your development environment is ready:

1. ✅ **Phase 0 Complete** - Local dev setup working
2. ⏳ **Phase 1 Next**: Create database schema (`lib/db/schema.sql`)
3. ⏳ **Phase 1**: Build event browsing and filtering
4. ⏳ **Phase 2**: Add authentication and event submission

Check [specs/002-event-management/tasks.md](../specs/002-event-management/tasks.md) for detailed task breakdown.

---

## Need Help?

- **Documentation**: See `docs/` folder
- **Specifications**: See `specs/002-event-management/` folder
- **Vercel Docs**: https://vercel.com/docs
- **Node.js Docs**: https://nodejs.org/docs
- **OpenAI Docs**: Ask Claude to fetch via Context7 MCP

---

**Last Updated**: 2025-11-11
**Phase**: 0 (Setup)
**Status**: Ready for Phase 1 🚀
