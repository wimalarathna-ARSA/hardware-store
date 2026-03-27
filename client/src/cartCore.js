import { createContext } from 'react';

export const CartContext = createContext(null);

export const initialCartState = {
  items: [],
};

export function cartReducer(state, action) {
  if (action.type === 'LOAD_CART') {
    return action.payload;
  }

  if (action.type === 'ADD_ITEM') {
    const existingIndex = state.items.findIndex(
      (item) => item.id === action.payload.id,
    );

    if (existingIndex !== -1) {
      const items = state.items.slice();
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: items[existingIndex].quantity + action.payload.quantity,
      };
      return { ...state, items };
    }

    return {
      ...state,
      items: [...state.items, action.payload],
    };
  }

  if (action.type === 'UPDATE_QUANTITY') {
    return {
      ...state,
      items: state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        )
        .filter((item) => item.quantity > 0),
    };
  }

  if (action.type === 'REMOVE_ITEM') {
    return {
      ...state,
      items: state.items.filter((item) => item.id !== action.payload.id),
    };
  }

  if (action.type === 'CLEAR') {
    return initialCartState;
  }

  if (action.type === 'REMOVE_ITEMS') {
    const idsToRemove = new Set(action.payload.ids);
    return {
      ...state,
      items: state.items.filter((item) => !idsToRemove.has(item.id)),
    };
  }

  return state;
}

