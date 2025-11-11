# Post-Deployment Checklist - evHenter

Etter at du har opprettet Vercel-prosjektet, database og domene, følg denne sjekklisten for å verifisere at alt fungerer.

## ✅ Deployment Status

### 1. Check Vercel Deployment URL

Visit your Vercel deployment URL (you got this when deploying):
```
https://evhenter-xxx.vercel.app
```

**Expected:**
- ✅ Page loads without errors
- ✅ Shows "Velkommen til evHenter"
- ✅ System status section visible
- ✅ No 404 or 500 errors

**Action if fails:**
- Go to Vercel Dashboard → Deployments
- Click latest deployment
- Check build logs for errors

---

## ✅ Database Connection

### 2. Verify Database Environment Variables

In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Check these variables exist:

**Must be present:**
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

These should have been auto-added when you connected the database.

**Action if missing:**
- Go to **Storage** → Click your Postgres database
- Click **".env.local"** tab
- Copy all variables
- Add to **Settings** → **Environment Variables**
- Select: **Production**, **Preview**, **Development**
- Redeploy

---

## ✅ Additional Environment Variables

### 3. Add Required Environment Variables

These need to be added manually:

#### Authentication (Required)

```bash
# Generate JWT secret:
# Run in terminal: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

JWT_SECRET=your-generated-secret-here
JWT_EXPIRES_IN=7d
COOKIE_DOMAIN=.evhenter.ai
COOKIE_SECURE=true
```

#### Application Settings (Required)

```bash
NODE_ENV=production
APP_URL=https://evhenter.ai
EVENTS_PER_PAGE=24
```

#### Feature Flags (Required)

```bash
ENABLE_AI_PARSING=false
ENABLE_AI_IMAGES=false
ENABLE_COMMUNITY_APPROVAL=false
ENABLE_EMAIL_NOTIFICATIONS=false
```

#### Rate Limiting (Optional - defaults exist)

```bash
RATE_LIMIT_SUBMISSIONS=5
RATE_LIMIT_APPROVALS=50
```

**How to add:**
1. Vercel Dashboard → Settings → Environment Variables
2. Click **"Add Variable"**
3. Enter Name and Value
4. Select all environments: **Production**, **Preview**, **Development**
5. Click **"Save"**
6. Repeat for each variable
7. **Redeploy** after adding all

**Quick way to redeploy:**
- Go to **Deployments** tab
- Click **"..."** on latest deployment → **"Redeploy"**
- Or just push a commit to GitHub

---

## ✅ Domain Configuration

### 4. Check Domain Status

In Vercel Dashboard → Settings → Domains:

**Should show:**
- ✅ `evhenter.ai` - Valid configuration
- ✅ `www.evhenter.ai` - Redirect to evhenter.ai
- ✅ SSL Certificate issued

**If shows "Invalid Configuration":**

#### Check DNS Records at your domain registrar:

**For evhenter.ai (apex):**
```
Type: A
Name: @ (or root/apex)
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

**Verification Record (if required):**
```
Type: TXT
Name: _vercel
Value: [Vercel will show this in dashboard]
TTL: 3600
```

**DNS Propagation:**
- Takes 1-48 hours (usually 1-4 hours)
- Check status: `nslookup evhenter.ai`
- Or use: https://dnschecker.org

---

## ✅ Test Your Deployment

### 5. Test Homepage

Visit: **https://evhenter.ai** (or Vercel URL if DNS not ready)

**Checklist:**
- [ ] Page loads without errors
- [ ] No mixed content warnings (check for green padlock)
- [ ] No console errors (press F12)
- [ ] System Status shows API health
- [ ] "Coming Soon" section visible

### 6. Test API Health Endpoint

Visit: **https://evhenter.ai/api/health**

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-11T...",
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

**Key checks:**
- ✅ `status`: "healthy"
- ✅ `environment`: "production" (not "development")
- ✅ `database`: "configured" (not "not-configured")

**If database shows "not-configured":**
- Environment variables not set correctly
- Redeploy after adding variables

### 7. Check API Status on Homepage

On homepage, scroll to "System Status" section.

**Should show GREEN:**
- ✅ API Status: healthy
- ✅ Environment: production
- ✅ Database: configured

**If shows RED:**
- API might be failing
- Check browser console for errors
- Check Vercel logs

---

## ✅ Analytics

### 8. Verify Analytics is Tracking

1. Visit your site: **https://evhenter.ai**
2. Navigate around (click links, refresh page)
3. Wait **1-2 minutes**
4. Go to Vercel Dashboard → **Analytics** tab

**Should see:**
- ✅ Page views (at least 1)
- ✅ Web Vitals data appearing
- ✅ Real-time visitor count (if Pro plan)

**Check browser console:**
```
📊 Vercel Analytics loaded
📊 Vercel Analytics: Page loaded
```

**If analytics not working:**
- Open DevTools → Network tab
- Look for: `/_vercel/insights/script.js`
- Should return 200 OK
- If blocked by ad-blocker, that's expected (won't affect real users)

---

## ✅ Mobile Testing

### 9. Test on Mobile Device

Visit site on your phone: **https://evhenter.ai**

**Checklist:**
- [ ] Page loads on mobile data
- [ ] Responsive layout (no horizontal scroll)
- [ ] Touch targets work
- [ ] System status readable
- [ ] No layout breaks

---

## ✅ Database Schema (Phase 1)

### 10. Create Database Tables (Coming Soon)

Once we create the database schema SQL file, you'll need to run it:

**Option A: Vercel SQL Editor**
1. Go to Storage → Your Postgres database
2. Click **"Query"** tab
3. Paste SQL from `lib/db/schema.sql` (we'll create this in Phase 1)
4. Click **"Run"**

**Option B: Command Line**
```bash
# Using the POSTGRES_URL from Vercel
psql "postgres://..." < lib/db/schema.sql
```

**This creates tables for:**
- events
- users
- locations
- event_types
- approvals
- saved_filters

---

## 🔧 Troubleshooting

### Deployment Failed

**Check:**
1. Vercel Dashboard → Deployments → Click failed deployment
2. Read build logs
3. Common issues:
   - Missing dependencies → Check package.json
   - Build command failed → Check build output
   - Env vars missing → Add in Settings

**Fix:**
```bash
# Make a change and push
git commit --allow-empty -m "fix: redeploy"
git push origin main
```

### Database Connection Fails

**Symptoms:**
- API health shows database: "not-configured"
- Errors in logs about database connection

**Fix:**
1. Storage → Postgres → ".env.local" tab
2. Copy ALL postgres variables
3. Add to Settings → Environment Variables
4. Select ALL environments
5. Redeploy

### Domain Not Working

**Symptoms:**
- evhenter.ai shows "Domain not found"
- SSL certificate error

**Fix:**
1. Check DNS records at registrar
2. Wait for DNS propagation (up to 48h)
3. Check in Vercel: Settings → Domains
4. Should show "Valid configuration"

### Analytics Not Showing

**Symptoms:**
- No data in Analytics dashboard
- Console shows script blocked

**Fix:**
1. Wait 2-5 minutes after visiting site
2. Check you're in Production environment
3. Visit site in incognito mode (no ad-blocker)
4. Analytics only works on deployed site (not localhost)

---

## 📊 Verification Summary

Run through this quick checklist:

### Core Services
- [ ] Deployment successful and site loads
- [ ] Database connected (check API health)
- [ ] Environment variables added
- [ ] Domain working (or DNS propagating)
- [ ] SSL certificate active (green padlock)

### Features
- [ ] Homepage loads correctly
- [ ] API health endpoint responds
- [ ] System status shows green
- [ ] Analytics tracking page views
- [ ] Mobile responsive working

### Next Steps
- [ ] Database schema created (Phase 1)
- [ ] First event API endpoint (Phase 1)
- [ ] Event browsing UI (Phase 1)

---

## 🎯 What's Working Now?

After completing this checklist, you should have:

✅ **Production site live at evhenter.ai**
- Responsive homepage
- Working API
- Analytics tracking
- Database connected
- SSL secured

⏳ **Not Yet Implemented:**
- Database schema (Phase 1)
- Event browsing (Phase 1)
- Event submission (Phase 2)
- AI features (Phase 3)

---

## 🚀 Next: Phase 1 Implementation

Now that infrastructure is ready, next steps:

1. **Create database schema** (`lib/db/schema.sql`)
2. **Build Event API** (`api/events/index.js`)
3. **Build frontend** (event browsing with filters)

See [specs/002-event-management/tasks.md](../specs/002-event-management/tasks.md) for detailed task breakdown.

---

## 📞 Need Help?

If you encounter issues:

1. **Check Vercel Logs:**
   - Dashboard → Logs tab
   - Filter by Production
   - Look for errors

2. **Check Build Logs:**
   - Dashboard → Deployments
   - Click latest deployment
   - Read full build output

3. **Test Locally:**
   ```bash
   cd evHenter
   node server.js
   # Visit http://localhost:3000
   ```

4. **Review Documentation:**
   - [docs/vercel-deployment.md](vercel-deployment.md)
   - [docs/local-development.md](local-development.md)
   - [docs/analytics.md](analytics.md)

---

**Last Updated**: 2025-11-11
**Status**: Post-Deployment Verification 🔍
