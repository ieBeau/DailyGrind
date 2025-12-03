import './Basket.css';

import { useEffect, useState } from 'react';

import { useBasket } from '../../context/basket.context';
import { useShopper } from '../../context/shopper.context';

import { getOrderTax } from '../../api/order.api';

import BasketItem from '../../components/cards/BasketItem/BasketItem';
import Checkout from '../../components/misc/Checkout/Checkout';

export default function Basket () {

    const { shopper } = useShopper();
    const { isLoading, shoppingCart } = useBasket();

    const [quantity, setQuantity] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [taxAmount, setTaxAmount] = useState(0);

    useEffect(() => {
        if (!shopper || Object.keys(shoppingCart.products).length === 0) {
            setQuantity(0);
            setSubtotal(0);
            setTaxAmount(0);
            return;
        }
        
        const cartTotal = Object.values(shoppingCart.products).reduce((total, item) => total + item.PRICE * item.QUANTITY, 0);
        
        setQuantity(Object.values(shoppingCart.products).reduce((total, item) => total + item.QUANTITY, 0));
        
        // Task 3: Get Tax Amount
        getOrderTax(shopper?.STATE, cartTotal).then((data) => {
            setSubtotal(data.subtotal || cartTotal);
            setTaxAmount(data.tax || 0);
        });
    }, [shopper, shoppingCart]);

    const [showCheckout, setShowCheckout] = useState(false);

    const handleCheckout = () => {
        setShowCheckout(true);
    }

    const isEmpty = !shoppingCart || Object.keys(shoppingCart.products).length === 0;
    const maxItems = typeof shoppingCart.basket?.STATUS === "string" && shoppingCart.basket.STATUS.includes("NOT");

    return (
        <div className='basket'>
            { showCheckout && <Checkout amount={{ subtotal, taxAmount, total: subtotal + taxAmount }} onClose={() => setShowCheckout(false)} /> }

            <h1>Basket Page</h1>

            <div className='basket-body'>
                {
                    isLoading && ( <p>Loading...</p> )
                }
                {
                    !isLoading && isEmpty && (
                        <p className='basket-empty'>Your basket is empty</p>
                    )
                }
                {
                    !isLoading && !isEmpty && (
                        <>
                            <div className='basket-list'>
                                {
                                    Object.values(shoppingCart.products).map((item) => (
                                        <BasketItem key={item.IDPRODUCT} basket={shoppingCart.basket} item={item} />
                                    ))
                                }
                            </div>
                            <div className='basket-total-container'>
                                <h3>Shopping Cart</h3>

                                <div className='basket-total-location'>{shopper?.STATE ? `${shopper.STATE}, ${shopper.COUNTRY}` : ''}</div>

                                <table className='basket-total-details'>
                                    <tbody>
                                        <tr>
                                            <td className='basket-total-details-label'>Subtotal ({quantity} items):</td>
                                            <td className='basket-total-details-value'>${subtotal.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className='basket-total-details-label'>Taxes:</td>
                                            <td className='basket-total-details-value'>${taxAmount.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className='basket-total-details-line-container' colSpan="2">
                                                <hr className='basket-total-details-line' />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='basket-total-details-label'>Total:</td>
                                            <td className='basket-total-details-value'>${(subtotal + taxAmount).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <button
                                    onClick={handleCheckout}
                                    disabled={isEmpty || maxItems}
                                    aria-disabled={isEmpty || maxItems}
                                    tabIndex={isEmpty || maxItems ? -1 : 0}
                                    style={{
                                        pointerEvents: isEmpty || maxItems ? 'none' : 'auto',
                                        opacity: isEmpty || maxItems ? 0.6 : 1,
                                        cursor: isEmpty || maxItems ? 'default' : 'pointer'
                                    }}
                                >
                                    { maxItems ? shoppingCart.basket.STATUS : "Proceed to Checkout" }
                                </button>
                            </div>
                        </>
                    )
                }
                
            </div>
            
        </div>
    )
}
