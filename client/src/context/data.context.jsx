// DataContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

import { getShopperById, getShoppers, getShopperSpending } from "../api/shopper.api";
import { getProducts } from "../api/product.api";
import { getBasketItems, getBasketItemStatus, getBaskets } from "../api/basket.api";

// Context
const DataContext = createContext();

// Provider
export const DataProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [shoppers, setShoppers] = useState([]);
    const [products, setProducts] = useState([]);
    const [baskets, setBaskets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const shoppersData = await getShoppers();
            const productsData = await getProducts();
            const basketsData = await getBaskets();

            // Report 2: Shopper Spending
            const shopperAdditions = await Promise.all(
                shoppersData.map(async (shopper) => {
                    const spending = await getShopperSpending({ id: shopper.IDSHOPPER });
                    return { 
                        ...shopper,
                        fullname: `${shopper.FIRSTNAME} ${shopper.LASTNAME}`,
                        spending
                    }
                })
            );

            handleBaskets(basketsData);
            
            setShoppers(shopperAdditions);
            setProducts(productsData);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const refreshProducts = async () => {
        try {
            const productsData = await getProducts();
            setProducts(productsData);
        } catch (error) {
            console.error("Failed to refresh products:", error);
            // Optionally, setProducts([]); or handle error state here
        }
    }

    const handleBaskets = async (data) => {
        // Report 1: Basket Status
        const basketAdditions = await Promise.all(
            data.map(async (basket) => {
                const items = await getBasketItems(basket.IDBASKET);
                const quantity = items.reduce((sum, item) => sum + item.QUANTITY, 0);
                const status = await getBasketItemStatus(basket);
                return { ...basket, ITEMS: items, QUANTITY: quantity, STATUS: status };
            })
        );
        setBaskets(basketAdditions);
    };

    return (
        <DataContext.Provider value={{ isLoading, products, setProducts, refreshProducts, shoppers, setShoppers, baskets, setBaskets, handleBaskets }}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook for convenience
export const useData = () => useContext(DataContext);