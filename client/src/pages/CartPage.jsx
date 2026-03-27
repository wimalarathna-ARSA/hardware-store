import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../useCart.js';
import { useAuth } from '../AuthContext.jsx';

function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
  } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(new Set());

  const toggleSelect = (id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  };

  const selectedItems = items.filter((i) => selected.has(i.id));
  const selectedCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0);
  const selectedTotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (selected.size === 0) {
      alert('Please select at least one item to checkout');
      return;
    }
    navigate('/checkout', { state: { selectedItems } });
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Cart</h1>
      </div>

      {items.length === 0 ? (
        <p className="status">
          Your cart is empty. <Link to="/products">Browse products</Link>
        </p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selected.size === items.length && items.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>LKR {item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(
                          item.id,
                          Number(event.target.value),
                        )
                      }
                    />
                  </td>
                  <td>
                    LKR {(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <p>
              Selected: <strong>{selectedCount}</strong> items
            </p>
            <p>
              Total: <strong>LKR {selectedTotal.toFixed(2)}</strong>
            </p>
            {!isLoggedIn && (
              <p className="status">
                Please <Link to="/login" state={{ from: '/checkout' }}>login</Link> or <Link to="/register" state={{ from: '/checkout' }}>register</Link> to checkout
              </p>
            )}
            <button
              type="button"
              className="btn primary"
              onClick={handleCheckout}
            >
              Proceed to checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
