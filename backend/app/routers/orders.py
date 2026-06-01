from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.order import OrderCreate, OrderListItem, OrderResponse, OrderItemResponse
from app.services import order_service

router = APIRouter(prefix="/orders", tags=["orders"])


def _order_to_response(order) -> OrderResponse:
    items = [
        OrderItemResponse(
            id=item.id,
            product_id=item.product_id,
            product_name=item.product.name if item.product else "Unknown",
            quantity=item.quantity,
            unit_price=item.unit_price,
            line_total=item.unit_price * item.quantity,
        )
        for item in order.items
    ]
    return OrderResponse(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=order.customer.full_name if order.customer else "Unknown",
        total_amount=order.total_amount,
        created_at=order.created_at,
        items=items,
    )


def _order_to_list_item(order) -> OrderListItem:
    return OrderListItem(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=order.customer.full_name if order.customer else "Unknown",
        total_amount=order.total_amount,
        created_at=order.created_at,
        item_count=len(order.items),
    )


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(data: OrderCreate, db: Session = Depends(get_db)):
    order = order_service.create_order(db, data)
    return _order_to_response(order)


@router.get("", response_model=list[OrderListItem])
def list_orders(db: Session = Depends(get_db)):
    orders = order_service.list_orders(db)
    return [_order_to_list_item(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = order_service.get_order(db, order_id)
    return _order_to_response(order)


@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order_service.delete_order(db, order_id)
