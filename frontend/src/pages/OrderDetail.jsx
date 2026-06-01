import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import Loading from '../components/Loading';
import { useApp } from '../context/AppContext';

export default function OrderDetail() {
  const { id } = useParams();
  const { showToast } = useApp();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api
      .getOrder(id)
      .then(setOrder)
      .catch((err) => showToast(err.message, 'error'));
  }, [id, showToast]);

  if (!order) return <Loading />;

  return (
    <div className="page">
      <Link to="/orders" className="back-link">
        ← Back to Orders
      </Link>
      <h2 className="page-title">Order #{order.id}</h2>

      <div className="card order-detail">
        <p>
          <strong>Customer:</strong> {order.customer_name}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Total:</strong> ${Number(order.total_amount).toFixed(2)}
        </p>

        <h3>Line Items</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>${Number(item.unit_price).toFixed(2)}</td>
                  <td>${Number(item.line_total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
