# Hosting

## API (Railway)

1. New project on [railway.app](https://railway.app) from this repo.
2. Add **PostgreSQL** (database plugin only — do not connect your GitHub repo to the Postgres service).
3. Add a **second service** from GitHub for the API:
   - **Root Directory:** leave **empty** (repo root; uses `/Dockerfile`)
   - **Builder:** Dockerfile
   - Alternative: Root Directory `backend` and Dockerfile `Dockerfile` (uses `backend/Dockerfile`)
4. Variables on the API service: `DATABASE_URL` (from Postgres), `PORT=8000`, `CORS_ORIGINS` (optional until Vercel is live)
5. Public domain under Networking.

Check: `curl https://<api-host>/health`

### Build failed in a few seconds?

- Open the **API** service (not Postgres) → **Deployments** → click the failed deploy → read **Build Logs**.
- Postgres must not use your app repo or `backend` as root directory.
- Root directory must be exactly `backend` (no leading `/`).
- Push latest code: `git push origin main`, then redeploy.

## Frontend (Vercel)

1. Import repo on [vercel.com](https://vercel.com).
2. **Root Directory:** `frontend`
3. `VITE_API_URL` = Railway API URL (no trailing slash).
4. Set `CORS_ORIGINS` on Railway to the Vercel URL and redeploy the API.
