# Railway Deployment Guide for FastAPI Backend

This guide walks you through deploying the FastAPI campaigns backend to Railway.

## Prerequisites

- Railway account (sign up at https://railway.app)
- GitHub repository with your code pushed
- Backend code in the `backend` folder

## Files Added for Railway Deployment

1. **Procfile** - Tells Railway how to start the web server
2. **runtime.txt** - Specifies Python version
3. **railway.json** - Railway configuration (optional but recommended)

## Step-by-Step Deployment Instructions

### Step 1: Push Your Code to GitHub

Make sure all backend files are committed and pushed:

```powershell
# From your repository root
git add backend
git commit -m "feat: add Railway deployment config for backend"
git push origin main
```

### Step 2: Create a New Railway Project

1. Go to https://railway.app and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your repository: `Pratham2703005/Campaign-Analytics-Dashboard`

### Step 3: Configure the Service

1. After selecting the repo, Railway will create a new service
2. Click on the service card to open settings
3. Go to **Settings** tab
4. Under **"Root Directory"**, set it to: `backend`
   - This tells Railway to look in the backend folder for your app

### Step 4: Set Environment Variables (Optional for SQLite)

For SQLite (simple demo):
- No environment variables needed! The app will create `campaigns.db` automatically.

For PostgreSQL (production-ready):
1. In your Railway project, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will provision a Postgres database and create a `DATABASE_URL` variable
3. Update `main.py` to use PostgreSQL instead of SQLite (see section below)

### Step 5: Deploy

1. Railway will automatically start deploying after you configure the root directory
2. Watch the deployment logs in the **"Deployments"** tab
3. Once deployed, Railway will show a **"Public Domain"** (e.g., `your-app.up.railway.app`)
4. Click **"Settings"** → **"Networking"** → **"Generate Domain"** if no domain is shown

### Step 6: Test Your Deployed API

Once deployed, test your endpoints:

```powershell
# Replace YOUR-DOMAIN with your Railway public domain
curl https://YOUR-DOMAIN.up.railway.app/campaigns
curl "https://YOUR-DOMAIN.up.railway.app/campaigns?status=Active"
```

Or open in browser:
- API Docs: https://YOUR-DOMAIN.up.railway.app/docs
- Campaigns: https://YOUR-DOMAIN.up.railway.app/campaigns

### Step 7: Update Frontend Environment Variable

In your Vercel frontend deployment:
1. Go to Vercel dashboard → Your project → **Settings** → **Environment Variables**
2. Add or update: `NEXT_PUBLIC_API_URL` = `https://YOUR-DOMAIN.up.railway.app`
3. Redeploy the frontend so it fetches from your Railway backend

## Common Issues & Troubleshooting

### Issue: "Application failed to respond"
- Check logs in Railway dashboard → Deployments → Click deployment → View logs
- Ensure `Procfile` uses `$PORT` variable (Railway assigns this dynamically)
- Verify `requirements.txt` has all dependencies

### Issue: "Module not found" errors
- Make sure `requirements.txt` is in the `backend` folder
- Check that Railway root directory is set to `backend`

### Issue: CORS errors from frontend
- Update `allow_origins` in `main.py` to include your Vercel domain
- See the CORS section in `main.py` - it already includes wildcard for Vercel preview deployments

### Issue: Database not found
- For SQLite: The DB file is ephemeral on Railway (resets on redeploy). Use for testing only.
- For production: Add PostgreSQL database and update connection logic (see below)

## Upgrading to PostgreSQL (Production)

### 1. Add PostgreSQL to Railway

In Railway dashboard:
- Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
- Railway creates a `DATABASE_URL` environment variable automatically

### 2. Update requirements.txt

Add PostgreSQL driver:
```txt
fastapi
uvicorn[standard]
pydantic
psycopg2-binary
```

### 3. Create the table in PostgreSQL

Connect to your Railway Postgres using a SQL client or Railway's built-in psql:
- In Railway dashboard → PostgreSQL service → **"Data"** tab → **"Connect"**
- Run the SQL from `create_campaigns.sql`

### 4. Update main.py to use PostgreSQL

Replace the SQLite connection logic with:

```python
import os
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_conn():
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    return conn

def init_db():
    # Skip init_db for Postgres (run create_campaigns.sql manually)
    pass
```

Then redeploy on Railway.

## Monitoring & Logs

- View logs: Railway dashboard → Your service → **"Deployments"** → Click deployment → **"View Logs"**
- Metrics: Railway dashboard → Your service → **"Metrics"** tab shows CPU, memory, network usage

## Cost

- Railway offers a free tier with limited hours/month
- Pricing: https://railway.app/pricing
- For this simple API, you'll likely stay within free tier limits

## Next Steps

- Update your Vercel frontend to use the Railway backend URL
- Test the full stack (frontend + backend)
- Commit and push any changes
- Set up CI/CD: Railway auto-deploys on every push to main branch

---

**Your Railway backend URL:** https://YOUR-DOMAIN.up.railway.app

Don't forget to replace `YOUR-DOMAIN` with your actual Railway public domain!
