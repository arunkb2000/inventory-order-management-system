import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';

const emptyLine = { product_id: '', quantity: '1' };

export default function Orders() {
  const { showToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [lines, setLines] = useState([{ ...emptyLine }]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [o, c, p] = await Promise.all([api.getOrders(), api.getCustomers(), api.getProducts()]);
      setOrders(o);
      setCustomers(c);
      setProducts(p);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const addLine = () => setLines([...lines, { ...emptyLine }]);

  const updateLine = (index, field, value) => {
    const next = [...lines];
    next[index] = { ...next[index], [field]: value };
    setLines(next);
  };

  const removeLine = (index) => {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!customerId) {
      showToast('Select a customer', 'error');
      return;
    }
    const items = lines
      .filter((l) => l.product_id && Number(l.quantity) > 0)
      .map((l) => ({ product_id: Number(l.product_id), quantity: Number(l.quantity) }));

    if (items.length === 0) {
      showToast('Add at least one order line', 'error');
      return;
    }

    try {
      await api.createOrder({ customer_id: Number(customerId), items });
      showToast('Order created');
      setShowModal(false);
      setCustomerId('');
      setLines([{ ...emptyLine }]);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await api.deleteOrder(id);
      showToast('Order deleted');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Orders</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          disabled={customers.length === 0 || products.length === 0}
        >
          Create Order
        </button>
      </div>

      {(customers.length === 0 || products.length === 0) && (
        <p className="muted banner">Add a customer and at least one product first.</p>
      )}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link to={`/orders/${o.id}`}>#{o.id}</Link>
                  </td>
                  <td>{o.customer_name}</td>
                  <td>{o.item_count}</td>
                  <td>${Number(o.total_amount).toFixed(2)}</td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                  <td>
                    <Link to={`/orders/${o.id}`} className="btn btn-sm">
                      View
                    </Link>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(o.id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Create Order" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="form">
            <label>
              Customer
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.email})
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="order-lines">
              <legend>Order Items</legend>
              {lines.map((line, i) => (
                <div key={i} className="order-line">
                  <select
                    value={line.product_id}
                    onChange={(e) => updateLine(i, 'product_id', e.target.value)}
                    required
                  >
                    <option value="">Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (stock: {p.quantity_in_stock}) — ${Number(p.price).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => updateLine(i, 'quantity', e.target.value)}
                    placeholder="Qty"
                  />
                  {lines.length > 1 && (
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeLine(i)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-sm" onClick={addLine}>
                + Add line
              </button>
            </fieldset>

            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Place Order
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
