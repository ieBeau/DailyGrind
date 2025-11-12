// DataContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// Context
const DataContext = createContext();

const SERVER_URL = import.meta.env.PROD ? import.meta.env.VITE_SERVER_URL : '';

// Provider
export const DataProvider = ({ children }) => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const productsData = await getProducts();
            setProducts(productsData);
        }
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ products, setProducts }}>
            {children}
        </DataContext.Provider>
    );
};

const getProducts = async () => {
    const response =  await fetch(`${SERVER_URL}/api/product`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Products fetched!');
        return data;
    })
    .catch(error => {
        console.error('Error:', error);
        return [];
    });

    return response;
};

// Custom hook for convenience
export const useData = () => useContext(DataContext);