# Technical Assessment — Submission Checklist

Fill in the URLs after deploying. See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

## Deliverables

| Item | Your link |
|------|-----------|
| **GitHub repository** | https://github.com/arunkb2000/inventory-order-management-system |
| **Docker Hub (backend image)** | `https://hub.docker.com/r/YOUR_USER/inventory-backend` |
| **Live frontend (Vercel)** | `https://YOUR_APP.vercel.app` |
| **Live backend API (Railway)** | `https://YOUR_APP.up.railway.app` |
| **API documentation** | `{BACKEND_URL}/docs` |

## Quick verification

```bash
# Local (requires Docker)
cp .env.example .env
docker compose up --build

# Health check (deployed)
curl https://YOUR-RAILWAY-URL/health
```

Expected: `{"status":"ok"}`

## Requirements coverage

- [x] FastAPI backend with all product, customer, and order endpoints
- [x] React frontend (products, customers, orders, dashboard)
- [x] PostgreSQL with Docker Compose named volume
- [x] Unique SKU, unique email, non-negative stock, stock deduction on orders
- [x] Backend-calculated order totals and insufficient-stock validation
- [x] Production Dockerfiles (multi-stage backend, nginx frontend)
- [x] Environment variables via `.env` / hosting dashboards (no hardcoded secrets)

## Docker Hub publish

```bash
docker login
docker build -t YOUR_USER/inventory-backend:latest ./backend
docker push YOUR_USER/inventory-backend:latest
```
