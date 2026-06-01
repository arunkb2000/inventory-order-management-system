import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';

const emptyForm = { name: '', sku: '', price: '', quantity_in_stock: '' };

function validateProduct(form, isEdit) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!isEdit && !form.sku.trim()) errors.sku = 'SKU is required';
  if (form.price === '' || Number(form.price) <= 0) errors.price = 'Price must be greater than 0';
  if (form.quantity_in_stock === '' || Number(form.quantity_in_stock) < 0) {
    errors.quantity_in_stock = 'Quantity cannot be negative';
  }
  return errors;
}

export default function Products() {
  const { showToast } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await api.getProducts());
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm(emptyForm);
    setErrors({});
    setModal('create');
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      sku: p.sku,
      price: String(p.price),
      quantity_in_stock: String(p.quantity_in_stock),
    });
    setErrors({});
    setModal({ type: 'edit', id: p.id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = modal?.type === 'edit';
    const validation = validateProduct(form, isEdit);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity_in_stock: Number(form.quantity_in_stock),
    };

    try {
      if (isEdit) {
        await api.updateProduct(modal.id, payload);
        showToast('Product updated');
      } else {
        await api.createProduct(payload);
        showToast('Product created');
      }
      setModal(null);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      showToast('Product deleted');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Products</h2>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          Add Product
        </button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="muted">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>{p.quantity_in_stock}</td>
                  <td className="actions">
                    <button type="button" className="btn btn-sm" onClick={() => openEdit(p)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Add Product' : 'Edit Product'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <span className="error">{errors.name}</span>}
            </label>
            <label>
              SKU
              <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} disabled={modal?.type === 'edit'} />
              {errors.sku && <span className="error">{errors.sku}</span>}
            </label>
            <label>
              Price
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              {errors.price && <span className="error">{errors.price}</span>}
            </label>
            <label>
              Quantity in Stock
              <input type="number" min="0" value={form.quantity_in_stock} onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })} />
              {errors.quantity_in_stock && <span className="error">{errors.quantity_in_stock}</span>}
            </label>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
