from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.exceptions import AppException
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


def create_order(db: Session, data: OrderCreate) -> Order:
    customer = db.get(Customer, data.customer_id)
    if not customer:
        raise AppException("Customer not found", 404)

    product_ids = [item.product_id for item in data.items]
    if len(product_ids) != len(set(product_ids)):
        raise AppException("Duplicate products in order items", 400)

    products = (
        db.execute(
            select(Product).where(Product.id.in_(product_ids)).with_for_update()
        )
        .scalars()
        .all()
    )
    product_map = {p.id: p for p in products}

    if len(product_map) != len(product_ids):
        raise AppException("One or more products not found", 404)

    line_items: list[tuple[Product, int, Decimal]] = []
    total = Decimal("0")

    for item in data.items:
        product = product_map[item.product_id]
        if product.quantity_in_stock < item.quantity:
            raise AppException(
                f"Insufficient stock for product '{product.name}' (SKU: {product.sku}). "
                f"Available: {product.quantity_in_stock}, requested: {item.quantity}",
                409,
            )
        line_total = product.price * item.quantity
        total += line_total
        line_items.append((product, item.quantity, product.price))

    order = Order(customer_id=data.customer_id, total_amount=total)
    db.add(order)
    db.flush()

    for product, quantity, unit_price in line_items:
        product.quantity_in_stock -= quantity
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
                unit_price=unit_price,
            )
        )

    db.commit()
    db.refresh(order)
    return _load_order(db, order.id)


def delete_order(db: Session, order_id: int) -> None:
    order = (
        db.execute(
            select(Order)
            .where(Order.id == order_id)
            .options(selectinload(Order.items))
            .with_for_update()
        )
        .scalar_one_or_none()
    )
    if not order:
        raise AppException("Order not found", 404)

    for item in order.items:
        product = db.get(Product, item.product_id)
        if product:
            product.quantity_in_stock += item.quantity

    db.delete(order)
    db.commit()


def get_order(db: Session, order_id: int) -> Order:
    order = _load_order(db, order_id)
    if not order:
        raise AppException("Order not found", 404)
    return order


def list_orders(db: Session) -> list[Order]:
    return (
        db.execute(
            select(Order)
            .options(
                selectinload(Order.customer),
                selectinload(Order.items),
            )
            .order_by(Order.created_at.desc())
        )
        .scalars()
        .all()
    )


def _load_order(db: Session, order_id: int) -> Order | None:
    return (
        db.execute(
            select(Order)
            .where(Order.id == order_id)
            .options(
                selectinload(Order.customer),
                selectinload(Order.items).selectinload(OrderItem.product),
            )
        )
        .scalar_one_or_none()
    )
