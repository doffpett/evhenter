# Vercel Deployment Guide - evHenter

Step-by-step guide to deploy evHenter to Vercel Cloud and configure all services.

## Prerequisites

- ✅ GitHub account with evhenter repository
- ✅ Vercel account ([Sign up](https://vercel.com/signup))
- ✅ Domain evHenter.ai (registered)
- ⏳ OpenAI API key (optional for Phase 3)

## Step 1: Import Project to Vercel

### 1.1 Connect GitHub Account

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. If not connected:
   - Click **"Connect Git Provider"**
   - Select **GitHub**
   - Authorize Vercel to access your repositories

### 1.2 Import Repository

1. Find `doffpett/evhenter` in the repository list
2. Click **"Import"**

### 1.3 Configure Project

**Framework Preset:** Other (or None)

**Root Directory:** `./` (leave default)

**Build Command:**
```bash
npm run build
```

**Output Directory:** `public`

**Install Command:**
```bash
npm install
```

### 1.4 Environment Variables (Optional - Add Later)

Skip for now - we'll add these after creating the database.

Click **"Deploy"**

🎉 Your first deployment will start! This takes ~2-3 minutes.

---

## Step 2: Verify Initial Deployment

### 2.1 Wait for Deployment

Watch the build logs in the Vercel dashboard. You should see:
```
✓ Installing dependencies...
✓ Building...
✓ Deploying...
```

### 2.2 Visit Deployment URL

Once complete, you'll get a URL like:
```
https://evhenter-xxx.vercel.app
```

Click **"Visit"** to see your site live!

You should see:
- ✅ evHenter welcome page
- ✅ System status showing services as "not-configured" (that's okay!)
- ✅ API health endpoint working

### 2.3 Check Analytics

1. In Vercel Dashboard, go to your project
2. Click **"Analytics"** tab
3. You should see it's enabled (might take a few minutes for first data)

---

## Step 3: Create Vercel Postgres Database

### 3.1 Create Database

1. In Vercel Dashboard, go to your project
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Choose settings:
   - **Region:** `iad1` (US East) or closest to your users
   - **Name:** `evhenter-db`
6. Click **"Create"**

⏳ Database creation takes ~30 seconds

### 3.2 Connect to Project

1. Once created, click on the database
2. Click **"Connect Project"**
3. Select your project: `evhenter`
4. Click **"Connect"**

✅ This automatically adds database environment variables to your project!

### 3.3 Get Database Credentials

1. In the database page, click **".env.local"** tab
2. You'll see all the `POSTGRES_*` variables
3. These are already added to your Vercel project
4. Copy them if you want to update local `.env.local`

---

## Step 4: Add Additional Environment Variables

### 4.1 Required Variables (Add Now)

1. In Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Add these variables:

**Authentication:**
```bash
# Name: JWT_SECRET
# Value: [Generate with: openssl rand -base64 32]
# Environment: Production, Preview, Development

# Name: JWT_EXPIRES_IN
# Value: 7d

# Name: COOKIE_DOMAIN
# Value: .evhenter.ai

# Name: COOKIE_SECURE
# Value: true
```

**Application:**
```bash
# Name: NODE_ENV
# Value: production

# Name: APP_URL
# Value: https://evhenter.ai

# Name: EVENTS_PER_PAGE
# Value: 24
```

**Feature Flags:**
```bash
# Name: ENABLE_AI_PARSING
# Value: false

# Name: ENABLE_AI_IMAGES
# Value: false

# Name: ENABLE_COMMUNITY_APPROVAL
# Value: false
```

### 4.2 Optional Variables (Add Later - Phase 3)

**OpenAI (Phase 3):**
```bash
OPENAI_API_KEY=sk-...
OPENAI_PARSING_MODEL=gpt-4-turbo-preview
OPENAI_IMAGE_MODEL=dall-e-3
```

**Vercel Blob Storage (Phase 2):**
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### 4.3 Redeploy After Adding Variables

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"**
5. Click **"Redeploy"**

Or just push a new commit to GitHub - auto-deploys!

---

## Step 5: Create Vercel Blob Storage (Optional - Phase 2)

### 5.1 Create Blob Store

1. In Vercel Dashboard → Project → **Storage**
2. Click **"Create Database"**
3. Select **"Blob"**
4. Click **"Create"**

### 5.2 Get Token

1. Click on the Blob store
2. Copy the `BLOB_READ_WRITE_TOKEN`
3. Add it to Environment Variables (see Step 4.1)

---

## Step 6: Configure Domain (evHenter.ai)

### 6.1 Add Domain in Vercel

1. In Vercel Dashboard → Project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter: `evhenter.ai`
4. Click **"Add"**

### 6.2 Add www Subdomain

1. Click **"Add"** again
2. Enter: `www.evhenter.ai`
3. Click **"Add"**
4. Select **"Redirect to evhenter.ai"**

### 6.3 Configure DNS Records

Go to your domain registrar (where you bought evHenter.ai) and add these DNS records:

#### For evhenter.ai (apex domain)

**Option A: A Record (Recommended)**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Option B: CNAME (if registrar supports CNAME flattening)**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

#### For www.evhenter.ai

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### Verification Record (Temporary)

Vercel will show a TXT record for verification:
```
Type: TXT
Name: _vercel
Value: vc-domain-verify=evhenter-xxx...
TTL: 3600
```

Add this temporarily (can remove after verification).

### 6.4 Wait for DNS Propagation

- DNS changes take **24-48 hours** to propagate globally
- Usually works within **1-4 hours**
- Check status in Vercel dashboard

### 6.5 SSL Certificate

- Vercel automatically provisions SSL certificate (Let's Encrypt)
- Happens after DNS verification
- Usually takes **5-10 minutes**
- Your site will be available at `https://evhenter.ai`

### 6.6 Verify Domain Works

Once DNS propagates:
1. Visit `https://evhenter.ai`
2. Should show your evHenter site
3. SSL certificate should be valid (green padlock)
4. Should auto-redirect `http://` to `https://`

---

## Step 7: Set Up Production Database Schema

### 7.1 Create Schema (Phase 1)

Once we create the database schema SQL file:

```bash
# Connect to Vercel Postgres
psql "postgres://..."

# Run schema file
\i lib/db/schema.sql

# Verify tables
\dt

# Exit
\q
```

Or use Vercel's SQL Editor:
1. Go to Storage → Postgres → **Query** tab
2. Paste SQL from `lib/db/schema.sql`
3. Click **"Run"**

### 7.2 Seed Data (Optional)

For testing:
```bash
# Run seed script
node lib/db/seed.js
```

This creates ~50 test events for development.

---

## Step 8: Configure Automatic Deployments

### 8.1 GitHub Integration (Already Set Up)

Vercel automatically deploys:
- ✅ **Push to `main`** → Production deployment (`evhenter.ai`)
- ✅ **Push to other branches** → Preview deployment (unique URL)
- ✅ **Pull requests** → Preview deployment with comment

### 8.2 Production Branch Settings

1. Settings → **Git** → **Production Branch**
2. Verify: `main`
3. All pushes to `main` deploy to `evhenter.ai`

### 8.3 Preview Deployments

Every branch and PR gets a unique URL:
```
https://evhenter-git-feature-branch-doffpett.vercel.app
```

Perfect for testing before merging!

---

## Step 9: Verify Everything Works

### 9.1 Check Deployment

Visit your production site:
```
https://evhenter.ai (once DNS propagates)
or
https://evhenter-xxx.vercel.app (Vercel URL)
```

✅ Homepage loads
✅ System status shows services configured
✅ No errors in browser console

### 9.2 Check API

Visit:
```
https://evhenter.ai/api/health
```

Should return:
```json
{
  "status": "healthy",
  "environment": "production",
  "version": "0.1.0",
  "services": {
    "api": "operational",
    "database": "configured",
    "openai": "not-configured",
    "storage": "not-configured"
  }
}
```

### 9.3 Check Analytics

1. Vercel Dashboard → Project → **Analytics**
2. Wait 1-2 minutes after visiting site
3. Should see:
   - Page views (1+)
   - Web Vitals data
   - Geographic info

### 9.4 Test on Mobile

Visit site on mobile device:
- Should be responsive
- Touch targets should work
- No horizontal scrolling

---

## Step 10: Monitor and Maintain

### 10.1 View Logs

1. Vercel Dashboard → Project → **Logs**
2. Select **Production** environment
3. See real-time logs from serverless functions

### 10.2 View Analytics

1. **Analytics** tab
2. Monitor:
   - Page views
   - Web Vitals (performance)
   - Top pages
   - Geographic distribution

### 10.3 Check Deployments

1. **Deployments** tab
2. See all deployments
3. Rollback if needed (click **"..."** → **"Promote to Production"**)

### 10.4 Monitor Costs

1. **Usage** tab
2. Monitor:
   - Bandwidth usage
   - Serverless function invocations
   - Database storage
   - Blob storage

**Hobby Plan Limits:**
- 100 GB bandwidth/month
- 100 GB-hours serverless compute
- 256 MB database storage

---

## Troubleshooting

### Deployment Failed

**Check build logs:**
1. Deployments → Click on failed deployment
2. Read error messages
3. Common issues:
   - Missing dependencies → Check `package.json`
   - Build command failed → Check `npm run build`
   - Environment variables missing → Add to Settings

**Fix and redeploy:**
```bash
git commit -m "fix: deployment issue"
git push origin main
```

### Database Connection Fails

**Check environment variables:**
1. Settings → Environment Variables
2. Verify `POSTGRES_URL` exists
3. Should start with `postgres://`

**Test connection:**
```bash
# In Vercel Function Logs
console.log('DB URL:', process.env.POSTGRES_URL ? 'Set' : 'Missing');
```

### Domain Not Working

**DNS not propagated yet:**
- Wait 24-48 hours
- Check with: `nslookup evhenter.ai`
- Check with: `dig evhenter.ai`

**DNS records incorrect:**
- Verify A record: `76.76.21.21`
- Verify CNAME: `cname.vercel-dns.com`
- Check TTL (lower = faster propagation)

**SSL certificate pending:**
- Wait for DNS verification
- Check Vercel dashboard for certificate status
- Usually resolves automatically after DNS works

### Analytics Not Showing Data

**Wait for data:**
- Takes 1-2 minutes after first page view
- Refresh Analytics dashboard

**Check script loaded:**
- Open browser DevTools → Network tab
- Look for `/_vercel/insights/script.js`
- Should return 200 OK

**Check environment:**
- Analytics only works on Vercel deployments
- Doesn't work on `localhost` (by design)

---

## Deployment Checklist

### Pre-Deployment
- [x] Code committed to GitHub
- [x] Tests passing locally
- [x] Environment variables documented in `.env.example`
- [x] Documentation updated

### Initial Setup
- [ ] Vercel project created
- [ ] GitHub repository imported
- [ ] Initial deployment successful
- [ ] Vercel Postgres database created
- [ ] Database connected to project

### Configuration
- [ ] Environment variables added
- [ ] JWT secret generated and added
- [ ] Domain `evhenter.ai` added
- [ ] DNS records configured
- [ ] SSL certificate issued

### Verification
- [ ] Production site accessible
- [ ] API health endpoint working
- [ ] Database connection working
- [ ] Analytics tracking page views
- [ ] Mobile responsive working
- [ ] No console errors

### Post-Deployment
- [ ] Database schema deployed
- [ ] Seed data loaded (optional)
- [ ] Monitoring configured
- [ ] Team members invited to Vercel project

---

## Production URLs

After setup completes:

**Main Site:**
```
https://evhenter.ai
https://www.evhenter.ai (redirects to above)
```

**API:**
```
https://evhenter.ai/api/health
https://evhenter.ai/api/events (Phase 1)
```

**Preview Deployments:**
```
https://evhenter-git-[branch]-doffpett.vercel.app
```

**Vercel Dashboard:**
```
https://vercel.com/doffpett/evhenter
```

---

## Next Steps After Deployment

1. ✅ **Phase 0 Complete** - Deployed to production!
2. ⏳ **Phase 1** - Build event browsing and filtering
3. ⏳ **Phase 2** - Add authentication and submission
4. ⏳ **Phase 3** - Integrate AI features
5. ⏳ **Phase 4** - Enable community approval

---

## Cost Summary (Monthly)

**Vercel Hobby Plan (Free):**
- 100 GB bandwidth
- 100 GB-hours serverless
- Unlimited deployments
- Preview deployments
- Analytics (1 day retention)
- SSL certificates

**Vercel Postgres (Hobby - Free):**
- 256 MB storage
- 60 hours compute time
- Enough for ~1000 events

**Total:** $0/month initially

**Upgrade triggers:**
- Need more bandwidth → Pro ($20/month)
- Need more database storage → Postgres Pro ($24/month)
- Need 30-day analytics retention → Pro plan

---

**Last Updated**: 2025-11-11
**Status**: Ready for Deployment 🚀
