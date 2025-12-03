import { useEffect, useState } from "react";
import "./BasketItem.css";
import { addBasketItem, deleteBasketItem } from "../../../api/basket.api";
import { useBasket } from "../../../context/basket.context";
import { useData } from "../../../context/data.context";

export default function BasketItemCard({ basket, item }) {

    const { baskets, handleBaskets } = useData();
    const { setShoppingCart } = useBasket();

    const [initializing, setInitializing] = useState(true);
    const [quantity, setQuantity] = useState(item.QUANTITY);

    const handleChange = (value) => {
        const raw = value.toString();
        
        if (raw === '') {
            setQuantity(0);
            return;
        }

        if (!/^\d*$/.test(raw)) return;

        let normalized = raw.replace(/^0+(?=\d)/, '');
        if (normalized === '') normalized = '0';

        const num = parseInt(normalized, 10);
        if (!isFinite(num)) return;

        const clamped = Math.max(0, Math.min(99, num));
        setQuantity(clamped);

        setInitializing(false);
    }

    // Task 5: Add Basket Item
    useEffect(() => {
        if (initializing) return;

        const timeout = setTimeout(() => {
            if (quantity === 0) deleteBasketItem(basket.IDBASKET, item.IDBASKETITEM);
            else addBasketItem(basket.IDBASKET, item, quantity);

            // Update shopping cart in Basket Context
            setShoppingCart(prev => {
                const updatedProducts = { ...prev.products };
                updatedProducts[item.IDPRODUCT] = { ...updatedProducts[item.IDPRODUCT], QUANTITY: quantity };
                return { ...prev, products: updatedProducts };
            });

            // Update baskets quantity and items in Data Context
            const basketAddition = baskets.map(prevBasket => {
                if (prevBasket.IDBASKET === basket.IDBASKET) {
                    const basketQuantity = prevBasket.ITEMS.reduce((sum, bi) => {
                        if (bi.IDPRODUCT === item.IDPRODUCT) return sum + quantity;
                        return sum + bi.QUANTITY;
                    }, 0);

                    const updatedItems = prevBasket.ITEMS.map(bi => {
                        if (bi.IDPRODUCT === item.IDPRODUCT) return { ...bi, QUANTITY: quantity };
                        return bi;
                    });

                    return { ...prevBasket, QUANTITY: basketQuantity, ITEMS: updatedItems };
                }
                return prevBasket;
            });
            
            handleBaskets(basketAddition);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [quantity]);

    return (
        <div key={item.IDPRODUCT} className='basket-item-card'>
            <div className="basket-item-header">
                <p className="basket-item-name">{item.PRODUCTNAME}</p>
                <p>${item.PRICE.toFixed(2)}</p>
            </div>
            <div className="basket-item-body">
                <img src={item.IMAGEURL} alt={item.PRODUCTNAME} className="basket-item-image" />
                <p className="basket-item-description">{item.DESCRIPTION}</p>
                <table>
                    <tbody>
                        <tr className="basket-item-table-header">
                            <td>Qty</td>
                            <td className="basket-item-total">Total</td>
                        </tr>
                        <tr>
                            <td><input className="basket-item-quantity" type="number" min="0" max="99" value={quantity} onChange={e => handleChange(e.target.value)} /></td>
                            <td className="basket-item-total-value">${(item.PRICE * quantity).toFixed(2)}</td> 
                        </tr>
                        <tr>
                            <td>                            
                                <div className="basket-quick-actions">
                                    <button className="add-btn" onClick={() => handleChange(quantity + 1)}>ADD</button>
                                    <button className="remove-btn" onClick={() => handleChange(quantity - 1)}>REMOVE</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
