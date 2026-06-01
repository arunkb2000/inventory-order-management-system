import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Loading from '../components/Loading';
import { useApp } from '../context/AppContext';

const LOW_STOCK_THRESHOLD = 10;

export default function Dashboard() {
  const { showToast } = useApp();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [products, customers, orders] = await Promise.all([
          api.getProducts(),
          api.getCustomers(),
          api.getOrders(),
        ]);
        const lowStock = products.filter((p) => p.quantity_in_stock < LOW_STOCK_THRESHOLD);
        setStats({
          productCount: products.length,
          customerCount: customers.length,
          orderCount: orders.length,
          lowStock,
        });
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
    load();
  }, [showToast]);

  if (!stats) return <Loading />;

  return (
    <div className="page">
      <h2 className="page-title">Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{stats.productCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value">{stats.customerCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{stats.orderCount}</span>
        </div>
        <div className="stat-card stat-warning">
          <span className="stat-label">Low Stock Items</span>
          <span className="stat-value">{stats.lowStock.length}</span>
        </div>
      </div>

      <section className="card">
        <h3>Low Stock Products (&lt; {LOW_STOCK_THRESHOLD} units)</h3>
        {stats.lowStock.length === 0 ? (
          <p className="muted">No low-stock items.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td className="text-warning">{p.quantity_in_stock}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Link to="/products" className="link-btn">
          View products
        </Link>
      </section>
    </div>
  );
}
