# Inventory & Order Management System

Full-stack inventory and order management application with FastAPI, React, PostgreSQL, and Docker.

## Live URLs

| Resource | URL |
|----------|-----|
| Frontend (Vercel) | _Set after deployment — see [DEPLOYMENT.md](./DEPLOYMENT.md)_ |
| Backend API (Railway) | _Set after deployment — see [DEPLOYMENT.md](./DEPLOYMENT.md)_ |
| API Docs | `{BACKEND_URL}/docs` |
| Docker Hub (backend) | _Set after `docker push`_ |
| GitHub Repository | _Run `./scripts/setup-github.sh` after `gh auth login`_ |

## Quick start (after clone)

```bash
# 1. Push to GitHub (one-time; requires GitHub CLI)
brew install gh   # if needed
gh auth login
chmod +x scripts/*.sh
./scripts/setup-github.sh inventory-order-management-system

# 2. Run locally with Docker
cp .env.example .env
docker compose up --build
```

## Features

- **Products** — CRUD with unique SKU, non-negative stock
- **Customers** — Create, list, view, delete with unique email
- **Orders** — Multi-item orders, automatic total calculation, stock deduction on create, stock restore on cancel
- **Dashboard** — Totals and low-stock alerts

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy, PostgreSQL
- Frontend: React (Vite), React Router
- Containers: Docker, Docker Compose

## Local Development (Docker)

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Environment Variables

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |
| `DATABASE_URL` | SQLAlchemy connection string |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `PORT` | Backend port (default 8000) |
| `VITE_API_URL` | Backend URL for frontend builds |

## API Endpoints

### Products
- `POST /products` — Create product
- `GET /products` — List products
- `GET /products/{id}` — Get product
- `PUT /products/{id}` — Update product
- `DELETE /products/{id}` — Delete product

### Customers
- `POST /customers` — Create customer
- `GET /customers` — List customers
- `GET /customers/{id}` — Get customer
- `DELETE /customers/{id}` — Delete customer

### Orders
- `POST /orders` — Create order
- `GET /orders` — List orders
- `GET /orders/{id}` — Get order
- `DELETE /orders/{id}` — Cancel/delete order

## Deployment

### Railway (backend + PostgreSQL)

1. Create a Railway project and add PostgreSQL.
2. Deploy from GitHub with root directory `backend/` or Dockerfile path `backend/Dockerfile`.
3. Set `DATABASE_URL` (from Postgres plugin), `CORS_ORIGINS` (your Vercel URL), `PORT=8000`.
4. Generate a public domain.

### Vercel (frontend)

1. Import the repo; set root directory to `frontend/`.
2. Set `VITE_API_URL` to your Railway backend URL (no trailing slash).
3. Deploy.

### Docker Hub

```bash
docker build -t YOUR_USER/inventory-backend:latest ./backend
docker push YOUR_USER/inventory-backend:latest
```

## License

MIT
