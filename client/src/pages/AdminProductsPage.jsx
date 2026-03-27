import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

function AdminProductsPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newMainCategory, setNewMainCategory] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState(false);
  const [form, setForm] = useState({
    _id: null,
    name: '',
    mainCategory: '',
    subCategory: '',
    price: '',
    brand: '',
    stockQuantity: '',
    description: '',
    inStock: true,
    image: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.role !== 'admin')) {
      navigate('/login', { state: { from: '/admin/products' } });
    }
  }, [isLoggedIn, user, loading, navigate]);

  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      loadProducts();
      loadCategories();
    }
  }, [isLoggedIn, user]);

  const loadProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch(() => setLoadingProducts(false));
  };

  const loadCategories = () => {
    fetch('http://localhost:5000/api/products/categories')
      .then((res) => res.json())
      .then((data) => {
        setMainCategories(data.main || []);
        setSubCategories(data.sub || []);
      });
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(lower));
    }
    if (categoryFilter) {
      list = list.filter((p) => p.mainCategory === categoryFilter);
    }
    if (stockFilter) {
      list = list.filter((p) => (stockFilter === 'in' ? p.inStock : !p.inStock));
    }
    return list;
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      _id: null,
      name: '',
      mainCategory: '',
      subCategory: '',
      price: '',
      brand: '',
      stockQuantity: '',
      description: '',
      inStock: true,
      image: '',
    });
    setNewMainCategory(false);
    setNewSubCategory(false);
    setError('');
  };

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    setForm({
      _id: product._id,
      name: product.name,
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
      price: product.price,
      brand: product.brand || '',
      stockQuantity: product.stockQuantity || '',
      description: product.description || '',
      inStock: product.inStock,
      image: product.images?.[0] || product.image || '',
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form._id) {
      const confirmed = window.confirm('Are you sure you want to save changes to this product?');
      if (!confirmed) return;
    }

    setError('');
    setSubmitting(true);

    const url = form._id ? `http://localhost:5000/api/products/${form._id}` : 'http://localhost:5000/api/products';
    const method = form._id ? 'PUT' : 'POST';

    try {
      console.log('Sending form:', form);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log('Response:', data);

      if (!res.ok) {
        setError(data.message || 'Failed to save product');
        setSubmitting(false);
        return;
      }

      setShowForm(false);
      resetForm();
      await loadProducts();
      await loadCategories();
      setSubmitting(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong');
      setSubmitting(false);
    }
  };

  const requestDelete = (product) => {
    setConfirmAction({ type: 'delete', product });
  };

  const executeDelete = async () => {
    if (!confirmAction?.product) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${confirmAction.product._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        loadProducts();
        loadCategories();
      }
    } catch {
      // ignore
    }
    setConfirmAction(null);
  };

  if (loading || !isLoggedIn || user?.role !== 'admin') {
    return <div className="page"><p className="status">Loading...</p></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Products ({products.length})</h1>
        <button type="button" className="btn primary" onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}>
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {confirmAction && (
        <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #f97316', borderRadius: '0.5rem', backgroundColor: '#1a1a1a' }}>
          <p>Are you sure you want to delete <strong>{confirmAction.product.name}</strong>?</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn primary" onClick={executeDelete}>Yes, Delete</button>
            <button type="button" className="btn ghost" onClick={() => setConfirmAction(null)}>Cancel</button>
          </div>
        </div>
      )}

      {showForm && (
        <form className="checkout-form" onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #1f2937', borderRadius: '0.75rem' }}>
          <h3>{form._id ? 'Edit Product' : 'Add New Product'}</h3>
          {error && <p className="error">{error}</p>}
          
          <label>
            Product Name
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Main Category
            {!newMainCategory ? (
              <>
                <select name="mainCategory" value={form.mainCategory} onChange={handleChange} required>
                  <option value="">Select or type new</option>
                  {mainCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button type="button" className="link-button" onClick={() => setNewMainCategory(true)} style={{ marginLeft: '0.5rem' }}>
                  + New Category
                </button>
              </>
            ) : (
              <>
                <input type="text" name="mainCategory" value={form.mainCategory} onChange={handleChange} placeholder="Type new category" required />
                <button type="button" className="link-button" onClick={() => { setNewMainCategory(false); setForm((p) => ({ ...p, mainCategory: '' })); }} style={{ marginLeft: '0.5rem' }}>
                  Use Existing
                </button>
              </>
            )}
          </label>

          <label>
            Sub Category
            {!newSubCategory ? (
              <>
                <select name="subCategory" value={form.subCategory} onChange={handleChange} required>
                  <option value="">Select or type new</option>
                  {subCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button type="button" className="link-button" onClick={() => setNewSubCategory(true)} style={{ marginLeft: '0.5rem' }}>
                  + New Sub Category
                </button>
              </>
            ) : (
              <>
                <input type="text" name="subCategory" value={form.subCategory} onChange={handleChange} placeholder="Type new sub category" required />
                <button type="button" className="link-button" onClick={() => { setNewSubCategory(false); setForm((p) => ({ ...p, subCategory: '' })); }} style={{ marginLeft: '0.5rem' }}>
                  Use Existing
                </button>
              </>
            )}
          </label>

          <label>
            Price (LKR)
            <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
          </label>

          <label>
            Brand
            <input type="text" name="brand" value={form.brand} onChange={handleChange} />
          </label>

          <label>
            Stock Quantity
            <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} min="0" />
          </label>

          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} />
            In Stock
          </label>

          <label>
            Image URL
            <input type="url" name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </label>

          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? 'Saving...' : (form._id ? 'Save Changes' : 'Add Product')}
          </button>
        </form>
      )}

      <div className="filters" style={{ alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {mainCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="">All Stock</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {loadingProducts ? (
        <p className="status">Loading products...</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Main Category</th>
              <th>Sub Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id || p.id}>
                <td>{p.name}</td>
                <td>{p.mainCategory}</td>
                <td>{p.subCategory}</td>
                <td>LKR {p.price?.toFixed(2)}</td>
                <td>{p.inStock ? 'In Stock' : 'Out of Stock'}</td>
                <td>
                  <button type="button" className="link-button" onClick={() => handleEdit(p)} style={{ marginRight: '0.5rem' }}>Edit</button>
                  <button type="button" className="link-button" onClick={() => requestDelete(p)} style={{ color: '#f97373' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProductsPage;
