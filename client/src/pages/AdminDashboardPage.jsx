import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

function AdminDashboardPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.role !== 'admin')) {
      navigate('/login', { state: { from: '/admin' } });
    }
  }, [isLoggedIn, user, loading, navigate]);

  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      fetch('http://localhost:5000/api/products')
        .then((res) => res.json())
        .then((data) => setProductCount(data.length));
    }
  }, [isLoggedIn, user]);

  if (loading || !isLoggedIn || user?.role !== 'admin') {
    return <div className="page"><p className="status">Loading...</p></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin dashboard</h1>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Sales</h2>
          <p>Total sales and monthly revenue will appear here.</p>
        </div>
        <Link to="/admin/products" className="dashboard-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>Products</h2>
          <p>Total: {productCount} products</p>
          <p>Manage products, categories, and brands.</p>
        </Link>
        <Link to="/admin/orders" className="dashboard-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>Orders</h2>
          <p>View customer orders and update status.</p>
        </Link>
        <div className="dashboard-card">
          <h2>Stock alerts</h2>
          <p>Low stock alerts will appear here.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
