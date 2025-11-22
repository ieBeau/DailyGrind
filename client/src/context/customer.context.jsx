// DataContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "../utils/fetchApi";

// Context
const CustomerContext = createContext();

const SERVER_URL = import.meta.env.PROD ? import.meta.env.VITE_SERVER_URL : '';

// Provider
export const CustomerProvider = ({ children }) => {

    const [customer, setCustomer] = useState({});

    const getCustomer = async (id) => {
        const customerData = await getCustomerData(id);
        setCustomer(customerData);
        return customerData;
    }

    return (
        <CustomerContext.Provider value={{ customer, setCustomer, getCustomer }}>
            {children}
        </CustomerContext.Provider>
    );
};

const getCustomerData = async (id) => {
    const response = await fetchApi(`/customer/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json())
    .catch(error => {
        console.error('Error:', error);
        return {};
    });

    return response;
};

// Custom hook for convenience
export const useCustomer = () => useContext(CustomerContext);