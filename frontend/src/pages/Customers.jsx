import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import { useApp } from '../context/AppContext';

const emptyForm = { full_name: '', email: '', phone: '' };

function validateCustomer(form) {
  const errors = {};
  if (!form.full_name.trim()) errors.full_name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email';
  if (!form.phone.trim()) errors.phone = 'Phone is required';
  return errors;
}

export default function Customers() {
  const { showToast } = useApp();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCustomers(await api.getCustomers());
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateCustomer(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    try {
      await api.createCustomer({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      showToast('Customer created');
      setShowModal(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await api.deleteCustomer(id);
      showToast('Customer deleted');
      load();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Customers</h2>
        <button type="button" className="btn btn-primary" onClick={() => { setForm(emptyForm); setErrors({}); setShowModal(true); }}>
          Add Customer
        </button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="muted">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.full_name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Add Customer" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="form">
            <label>
              Full Name
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              {errors.full_name && <span className="error">{errors.full_name}</span>}
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </label>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setShowModal(false)}>
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
