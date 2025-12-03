// CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useShopper } from "./shopper.context";
import { useData } from "./data.context";
import { getBasketItems } from "../api/basket.api";

// Context
const BasketContext = createContext();

// Provider
export const BasketProvider = ({ children }) => {
    
    const { shopper } = useShopper();
    const { baskets } = useData();
    
    const [shoppingCart, setShoppingCart] = useState({basket: null, products: {}});

    useEffect(() => {
        const fetchData = async () => {
            const fetchBasket = getCurrentBasket(shopper.IDSHOPPER, baskets)
            const fetchBasketItems = await getBasketItems(fetchBasket.IDBASKET);
            const productsById = (Array.isArray(fetchBasketItems) ? fetchBasketItems : []).reduce((acc, item) => {
                if (item && item.IDPRODUCT != null) acc[item.IDPRODUCT] = item;
                return acc;
            }, {});
            setShoppingCart({ basket: fetchBasket, products: productsById });
        };
        if (shopper?.IDSHOPPER) fetchData();
        else setShoppingCart({ basket: null, products: {} });
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