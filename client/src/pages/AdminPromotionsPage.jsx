import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

function AdminPromotionsPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    discount: '',
    active: true,
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.role !== 'admin')) {
      navigate('/login', { state: { from: '/admin/promotions' } });
    }
  }, [isLoggedIn, user, loading, navigate]);

  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      loadPromotions();
    }
  }, [isLoggedIn, user]);

  const loadPromotions = () => {
    const stored = localStorage.getItem('promotions');
    if (stored) {
      setPromotions(JSON.parse(stored));
    }
  };

  const savePromotions = (data) => {
    localStorage.setItem('promotions', JSON.stringify(data));
    setPromotions(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      title: '',
      description: '',
      discount: '',
      active: true,
    });
  };

  const handleEdit = (promo) => {
    setForm({ ...promo });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.id) {
      const confirmed = window.confirm('Save changes to this promotion?');
      if (!confirmed) return;
    }

    const stored = localStorage.getItem('promotions');
    const current = stored ? JSON.parse(stored) : [];

    if (form.id) {
      const updated = current.map((p) => (p.id === form.id ? { ...form } : p));
      savePromotions(updated);
    } else {
      const newPromo = { ...form, id: Date.now().toString() };
      savePromotions([...current, newPromo]);
    }

    setShowForm(false);
    resetForm();
  };

  const requestDelete = (promo) => {
    setConfirmDelete(promo);
  };

  const executeDelete = () => {
    if (!confirmDelete) return;
    const updated = promotions.filter((p) => p.id !== confirmDelete.id);
    savePromotions(updated);
    setConfirmDelete(null);
  };

  if (loading || !isLoggedIn || user?.role !== 'admin') {
    return <div className="page"><p className="status">Loading...</p></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Promotions ({promotions.length})</h1>
        <button type="button" className="btn primary" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
          {showForm ? 'Cancel' : 'Add Promotion'}
        </button>
      </div>

      {confirmDelete && (
        <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #f97316', borderRadius: '0.5rem', backgroundColor: '#1a1a1a' }}>
          <p>Delete <strong>{confirmDelete.title}</strong>?</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn primary" onClick={executeDelete}>Yes, Delete</button>
            <button type="button" className="btn ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
          </div>
        </div>
      )}

      {showForm && (
        <form className="checkout-form" onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #1f2937', borderRadius: '0.75rem' }}>
          <h3>{form.id ? 'Edit Promotion' : 'Add Promotion'}</h3>
          <label>
            Title
            <input type="text" name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows="2" />
          </label>
          <label>
            Discount
            <input type="text" name="discount" value={form.discount} onChange={handleChange} placeholder="e.g., 10% off" />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
            Active
          </label>
          <button type="submit" className="btn primary">{form.id ? 'Save Changes' : 'Add Promotion'}</button>
        </form>
      )}

      <table className="cart-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Discount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.description}</td>
              <td>{p.discount}</td>
              <td>{p.active ? 'Active' : 'Inactive'}</td>
              <td>
                <button type="button" className="link-button" onClick={() => handleEdit(p)} style={{ marginRight: '0.5rem' }}>Edit</button>
                <button type="button" className="link-button" onClick={() => requestDelete(p)} style={{ color: '#f97373' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPromotionsPage;
