import { useEffect, useMemo, useReducer, useState } from 'react';
import { CartContext, cartReducer, initialCartState } from './cartCore.js';
import { useAuth } from './AuthContext.jsx';

function CartProvider({ children }) {
  const { user, isLoggedIn } = useAuth();
  const userKey = user?.id ? `cart_${user.id}` : 'cart_guest';

  const getInitialState = () => {
    const saved = localStorage.getItem(userKey);
    return saved ? JSON.parse(saved) : initialCartState;
  };

  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const newState = getInitialState();
    dispatch({ type: 'LOAD_CART', payload: newState });
    setLoaded(true);
  }, [userKey]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(userKey, JSON.stringify(state));
    }
  }, [state, userKey, loaded]);

  const value = useMemo(
    () => ({
      items: state.items,
      addItem: (product, quantity = 1) =>
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            id: product._id || product.id,
            name: product.name,
            price: product.price,
            quantity,
          },
        }),
      updateQuantity: (id, quantity) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
      removeItem: (id) =>
        dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
      removeItems: (ids) =>
        dispatch({ type: 'REMOVE_ITEMS', payload: { ids } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      totalItems: state.items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
      totalPrice: state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    }),
    [state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
