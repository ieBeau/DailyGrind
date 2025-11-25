import { useEffect, useState } from "react";
import "./BasketItem.css";
import { updateBasketItem } from "../../../api/basket.api";
import { useBasket } from "../../../context/basket.context";
import { useData } from "../../../context/data.context";

export default function BasketItemCard({ basket, item }) {

    const { baskets, setBaskets, handleBaskets } = useData();
    const { setShoppingCart } = useBasket();

    const [initializing, setInitializing] = useState(true);
    const [quantity, setQuantity] = useState(item.QUANTITY);

    const handleChange = (e) => {
        const raw = e.target.value;
        
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
            updateBasketItem(basket, item, quantity);

            // Update shopping cart in Basket Context
            setShoppingCart(prev => {
                const updatedProducts = prev.products.map(prod => {
                    if (prod.IDPRODUCT === item.IDPRODUCT) return { ...prod, QUANTITY: quantity };
                    return prod;
                });
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
                            <td><input className="basket-item-quantity" type="number" min="0" max="99" value={quantity} onChange={handleChange} /></td>
                            <td className="basket-item-total-value">${(item.PRICE * quantity).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
