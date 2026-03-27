import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function AdminOrdersPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.role !== 'admin')) {
      navigate('/login', { state: { from: '/admin/orders' } });
    }
  }, [isLoggedIn, user, loading, navigate]);

  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      loadOrders();
    }
  }, [isLoggedIn, user]);

  const loadOrders = () => {
    const stored = localStorage.getItem('orders');
    if (stored) {
      const all = JSON.parse(stored);
      setOrders(all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  };

  const updateStatus = (orderId, newStatus) => {
    const stored = localStorage.getItem('orders');
    if (stored) {
      const all = JSON.parse(stored);
      const updated = all.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      localStorage.setItem('orders', JSON.stringify(updated));
      loadOrders();
    }
  };

  const deleteOrder = (orderId) => {
    const stored = localStorage.getItem('orders');
    if (stored) {
      const all = JSON.parse(stored);
      const updated = all.filter((o) => o.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updated));
      loadOrders();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#fbbf24';
      case 'Processing': return '#60a5fa';
      case 'Shipped': return '#a78bfa';
      case 'Delivered': return '#34d399';
      case 'Cancelled': return '#f87171';
      default: return '#9ca3af';
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const statusCounts = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status).length;
    return acc;
  }, {});

  if (loading || !isLoggedIn || user?.role !== 'admin') {
    return <div className="page"><p className="status">Loading...</p></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Orders ({orders.length})</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {STATUS_OPTIONS.map((status) => (
          <div
            key={status}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: getStatusColor(status),
              color: '#000',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            {status}: {statusCounts[status] || 0}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Filter by status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-filter-select"
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="status">No orders found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                border: '1px solid #1f2937',
                borderRadius: '0.75rem',
                padding: '1rem',
                backgroundColor: expanded === order.id ? '#111827' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#9ca3af' }}>
                    Order #{order.id.slice(-6)}
                  </p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                    User: {order.userId?.slice(-6) || 'Unknown'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor: getStatusColor(order.status),
                      color: '#000',
                    }}
                  >
                    {order.status}
                  </span>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>LKR {order.total.toFixed(2)}</p>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn small"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                {expanded === order.id ? 'Hide Details' : 'View Details'}
              </button>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="admin-status-select"
              >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn ghost small"
                  onClick={() => {
                    if (window.confirm('Delete this order?')) {
                      deleteOrder(order.id);
                    }
                  }}
                  style={{ color: '#f87171' }}
                >
                  Delete
                </button>
              </div>

              {expanded === order.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #374151' }}>
                  <h4 style={{ margin: '0 0 0.5rem' }}>Items</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name} x {item.quantity} - LKR {(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ margin: '0.25rem 0' }}>Subtotal: LKR {order.subtotal.toFixed(2)}</p>
                    {order.deliveryFee > 0 && (
                      <p style={{ margin: '0.25rem 0' }}>Delivery: LKR {order.deliveryFee.toFixed(2)}</p>
                    )}
                    <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>Total: LKR {order.total.toFixed(2)}</p>
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Customer:</strong> {order.customer.name}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Phone:</strong> {order.customer.phone}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Address:</strong> {order.customer.address}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Payment:</strong> {order.customer.paymentMethod}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;
