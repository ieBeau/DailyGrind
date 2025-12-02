// DataContext.js
import React, { createContext, useContext, useState } from "react";

// Context
const ShopperContext = createContext();

// Provider
export const ShopperProvider = ({ children }) => {

    const [shopper, setShopper] = useState(null);

    return (
        <ShopperContext.Provider value={{ shopper, setShopper }}>
            {children}
        </ShopperContext.Provider>
    );
};

// Custom hook for convenience
export const useShopper = () => useContext(ShopperContext);