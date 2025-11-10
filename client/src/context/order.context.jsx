// CartContext.js
import React, { createContext, useReducer, useContext } from "react";

// Actions
const ADD_ITEM = "ADD_ITEM";
const REMOVE_ITEM = "REMOVE_ITEM";
const CLEAR_CART = "CLEAR_CART";

// Initial state
const initialState = {
  items: [], // each item: { id, name, price, quantity }
};

// Reducer
function cartReducer(state, action) {
    switch (action.type) {
        case ADD_ITEM:
            const existingItemIndex = state.items.findIndex(item => item.id === action.payload.IDPRODUCT);
            if (existingItemIndex >= 0) {
                // Update quantity if item exists
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += 1;
                return { ...state, items: updatedItems };
            } else {
                const item = { id: action.payload.IDPRODUCT, name: action.payload.PRODUCTNAME, price: action.payload.PRICE, quantity: 1 };
                return { ...state, items: [...state.items, item] };
            }

        case REMOVE_ITEM:
            return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };

        case CLEAR_CART:
            return { ...state, items: [] };

        default:
            return state;
    }
}

// Context
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addItem = (item) => dispatch({ type: ADD_ITEM, payload: item });
    const removeItem = (item) => dispatch({ type: REMOVE_ITEM, payload: { id: item.IDPRODUCT } });
    const clearCart = () => dispatch({ type: CLEAR_CART });

    return (
        <CartContext.Provider value={{ cart: state, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook for convenience
export const useCart = () => useContext(CartContext);