// DataContext.js
import React, { createContext, useContext, useState } from "react";

// Context
const ShopperContext = createContext();

// Provider
export const ShopperProvider = ({ children }) => {

    const [shopper, setShopper] = useState({});

    return (
        <ShopperContext.Provider value={{ shopper, setShopper }}>
            {children}
        </ShopperContext.Provider>
    );
};

// Custom hook for convenience
export const useShopper = () => useContext(ShopperContext);