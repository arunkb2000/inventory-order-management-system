# Inventory

Web app for products, customers, and orders with stock tracking.

## Setup

```bash
cp .env.example .env
docker compose up --build
```

- UI: http://localhost:3000
- API: http://localhost:8000
- OpenAPI: http://localhost:8000/docs

## Stack

FastAPI, React (Vite), PostgreSQL, Docker Compose.

## Environment

| Variable | Purpose |
|----------|---------|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Database (Compose) |
| `DATABASE_URL` | API database URL |
| `CORS_ORIGINS` | Allowed browser origins |
| `PORT` | API port (default `8000`) |
| `VITE_API_URL` | API URL when building the frontend |

Hosting notes: [DEPLOYMENT.md](./DEPLOYMENT.md)

## License

MIT

## Live Deployment

Frontend:
https://inventory-order-management-system-khaki.vercel.app

Backend:
https://inventory-order-management-system-production.up.railway.app

Docker Hub:
https://hub.docker.com/r/arunbisariya/inventory-backend