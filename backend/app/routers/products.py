from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.exceptions import AppException
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", response_model=ProductResponse, status_code=201)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    product = Product(**data.model_dump())
    db.add(product)
    try:
        db.commit()
        db.refresh(product)
    except IntegrityError:
        db.rollback()
        raise AppException(f"Product with SKU '{data.sku}' already exists", 409)
    return product


@router.get("", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return db.execute(select(Product).order_by(Product.id)).scalars().all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise AppException("Product not found", 404)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise AppException("Product not found", 404)

    updates = data.model_dump(exclude_unset=True)
    if not updates:
        raise AppException("No fields to update", 400)

    for key, value in updates.items():
        setattr(product, key, value)

    try:
        db.commit()
        db.refresh(product)
    except IntegrityError:
        db.rollback()
        sku = updates.get("sku", product.sku)
        raise AppException(f"Product with SKU '{sku}' already exists", 409)
    return product


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise AppException("Product not found", 404)
    db.delete(product)
    db.commit()
