import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.database import Base, engine
from app.exceptions import AppException
from app.models import Customer, Order, OrderItem, Product  # noqa: F401
from app.routers import customers, orders, products

app = FastAPI(
    title="Inventory & Order Management API",
    description="Manage products, customers, and orders with inventory tracking",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    for attempt in range(30):
        try:
            Base.metadata.create_all(bind=engine)
            return
        except SQLAlchemyError:
            if attempt == 29:
                raise
            time.sleep(2)


@app.exception_handler(AppException)
async def app_exception_handler(_request: Request, exc: AppException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
