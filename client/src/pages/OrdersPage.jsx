import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

function OrdersPage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const newOrderId = location.state?.newOrderId;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isLoggedIn, navigate]);

  const loadOrders = () => {
    const stored = localStorage.getItem('orders');
    if (stored) {
      const all = JSON.parse(stored);
      const userOrders = all.filter((o) => o.userId === user?.id);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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

  if (!isLoggedIn) {
    return <div className="page"><p className="status">Please login to view orders.</p></div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Orders ({orders.length})</h1>
      </div>

      {newOrderId && (
        <div style={{ padding: '1rem', backgroundColor: '#064e3b', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          Order placed successfully! Order ID: <strong>#{newOrderId.slice(-6)}</strong>
        </div>
      )}

      {orders.length === 0 ? (
        <p className="status">
          No orders yet. <Link to="/products">Browse products</Link>
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
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

              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn small"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  {expanded === order.id ? 'Hide Details' : 'Track Order'}
                </button>
                {order.status === 'Delivered' && (
                  <button
                    type="button"
                    className="btn ghost small"
                    onClick={() => {
                      if (window.confirm('Remove this completed order from history?')) {
                        deleteOrder(order.id);
                      }
                    }}
                  >
                    Remove
                  </button>
                )}
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

export default OrdersPage;
