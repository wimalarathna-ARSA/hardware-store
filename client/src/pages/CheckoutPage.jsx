import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../useCart.js';
import { useAuth } from '../AuthContext.jsx';

const DELIVERY_FEE = 50;

function CheckoutPage() {
  const { items, removeItems } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const subtotal = useMemo(() =>
    selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems]
  );

  const deliveryFee = form.paymentMethod === 'cod' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isLoggedIn, navigate, location]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'phone') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: numbersOnly }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveOrder = () => {
    const order = {
      id: Date.now().toString(),
      userId: user?.id,
      customer: form,
      items: selectedItems,
      subtotal,
      deliveryFee,
      total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const stored = localStorage.getItem('orders');
    const orders = stored ? JSON.parse(stored) : [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return order;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedItems.length === 0) {
      setMessage('No items selected.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const order = saveOrder();
      removeItems(selectedItems.map((i) => i.id));
      setSubmitting(false);
      setMessage('Order placed successfully.');
      navigate('/orders', { state: { newOrderId: order.id } });
    }, 800);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-steps">
        <div className="checkout-step">
          <span>1</span>
          Cart
        </div>
        <div className="checkout-step active">
          <span>2</span>
          Details
        </div>
        <div className="checkout-step">
          <span>3</span>
          Confirm
        </div>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Customer name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone number (10 digits)
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Please enter exactly 10 digits"
              maxLength={10}
              placeholder="1234567890"
            />
          </label>

          <label>
            Delivery address
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </label>

          <fieldset className="payment-methods">
            <legend>Payment method</legend>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === 'cod'}
                onChange={handleChange}
              />
              Cash on delivery
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={form.paymentMethod === 'bank'}
                onChange={handleChange}
              />
              Bank transfer
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={form.paymentMethod === 'wallet'}
                onChange={handleChange}
              />
              Digital Wallet
            </label>
          </fieldset>

          {message && <p className="status">{message}</p>}

          <button
            type="submit"
            className="btn primary"
            disabled={submitting}
          >
            {submitting ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order summary</h2>
          {selectedItems.length === 0 ? (
            <p>No items selected.</p>
          ) : (
            <>
              <ul>
                {selectedItems.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity} - LKR {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <p>Subtotal: <strong>LKR {subtotal.toFixed(2)}</strong></p>
              {deliveryFee > 0 && (
                <p>Delivery fee: <strong>LKR {deliveryFee.toFixed(2)}</strong></p>
              )}
              <p>
                Total: <strong>LKR {total.toFixed(2)}</strong>
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
