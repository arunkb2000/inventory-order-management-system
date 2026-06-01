# Deployment Guide

## Railway (Backend + PostgreSQL)

1. Push this repository to GitHub.
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
3. Add **PostgreSQL** to the project (Railway injects `DATABASE_URL` into linked services).
4. Configure the backend service:
   - **Root directory:** `backend`
   - Or set Dockerfile path: `backend/Dockerfile`
5. Set environment variables on the backend service:
   - `DATABASE_URL` — reference from Postgres plugin (usually auto-linked)
   - `CORS_ORIGINS` — your Vercel URL, e.g. `https://your-app.vercel.app`
   - `PORT` — `8000`
6. Generate a **public domain** under Networking.
7. Verify: `curl https://YOUR-RAILWAY-URL/health`

## Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import GitHub repo.
2. **Root Directory:** `frontend`
3. Framework: **Vite**
4. Environment variable:
   - `VITE_API_URL` = `https://YOUR-RAILWAY-URL` (no trailing slash)
5. Deploy, then update Railway `CORS_ORIGINS` with the Vercel URL and redeploy backend if needed.

## Docker Hub

```bash
docker login
docker build -t YOUR_DOCKERHUB_USER/inventory-backend:latest ./backend
docker push YOUR_DOCKERHUB_USER/inventory-backend:latest
```

Image URL: `https://hub.docker.com/r/YOUR_DOCKERHUB_USER/inventory-backend`

## Submission checklist

- [ ] GitHub repository URL
- [ ] Docker Hub backend image URL
- [ ] Live Vercel frontend URL
- [ ] Live Railway backend URL
- [ ] Update README.md Live URLs table
