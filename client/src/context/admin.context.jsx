// AdminContext.js
import React, { createContext, useContext, useState } from "react";
import { login, logout } from "../api/admin.api";

// Context
const AdminContext = createContext();

// Provider
export const AdminProvider = ({ children }) => {

    const [admin, setAdmin] = useState(null);
    
    const signIn = async (userData) => {
        const data = await login(userData);
        setAdmin(data.admin);
    };

    const signOut = () => {
        logout();
        setAdmin(null);
    }

    return (
        <AdminContext.Provider value={{ admin, signIn, signOut }}>
            {children}
        </AdminContext.Provider>
    );
};

// Custom hook for convenience
export const useAdmin = () => useContext(AdminContext);