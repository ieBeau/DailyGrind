// CartContext.js
import React, { createContext, useReducer, useContext, useEffect, useState } from "react";
import { useShopper } from "./shopper.context";
import { useData } from "./data.context";
import { getBasketItems } from "../api/basket.api";

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
const BasketContext = createContext();

// Provider
export const BasketProvider = ({ children }) => {
    
    const { shopper } = useShopper();
    const { baskets } = useData();
    
    const [shoppingCart, setShoppingCart] = useState({basket: null, products: []});

    useEffect(() => {
        const fetchData = async () => {
            const fetchBasket = getCurrentBasket(shopper.IDSHOPPER, baskets)
            const fetchBasketItems = await getBasketItems(fetchBasket.IDBASKET);
            setShoppingCart({ basket: fetchBasket, products: fetchBasketItems });
        };
        if (shopper.IDSHOPPER) fetchData();
    }, [shopper, baskets]);

    return (
        <BasketContext.Provider value={{ shoppingCart, setShoppingCart }}>
            {children}
        </BasketContext.Provider>
    );
};

const getCurrentBasket = (id, baskets) => {
    let basketData;
    for (const basket of baskets) {
        if (basket.IDSHOPPER !== id) continue;

        if (!basketData || basketData?.IDBASKET < basket.IDBASKET) basketData = basket;
    }
    if (basketData) return basketData;
    return [];
}

// Custom hook for convenience
export const useBasket = () => useContext(BasketContext);