import { useState } from "react";

const [shoppingCart, setShoppingCart] = useState({});

const viewCart = () => {
    return shoppingCart;
}

const addToCart = (item) => {
    setShoppingCart(prevCart => {
        const updatedCart = { ...prevCart };
        updatedCart[item.EMPNO] = (updatedCart[item.EMPNO] || 0) + 1;
        return updatedCart;
    });
}

const removeFromCart = (item) => {
    setShoppingCart(prevCart => {
        const updatedCart = { ...prevCart };
        updatedCart[item.EMPNO] = (updatedCart[item.EMPNO] || 0) - 1;

        if (updatedCart[item.EMPNO] <= 0) delete updatedCart[item.EMPNO];

        return updatedCart;
    });
}

export { viewCart, addToCart, removeFromCart };