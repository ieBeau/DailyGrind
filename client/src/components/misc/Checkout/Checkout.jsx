import "./Checkout.css";

import { useShopper } from "../../../context/shopper.context";
import { useBasket } from "../../../context/basket.context";
import { useState } from "react";
import { updateBasketShippingStatus } from "../../../api/basket.api";

export default function Checkout({ amount, onClose }) {

  const { shopper } = useShopper();
  const { shoppingCart } = useBasket();
  
  const formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumberString;
  }

  const phoneNumber = formatPhoneNumber(shopper ? shopper.PHONE : "");

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleBasketCheckout = () => {

    const confirmButton = document.getElementById('confirm');
        
    // Task 4: Update Basket Shipping Status
    updateBasketShippingStatus(shoppingCart.basket)
    .then(_ => {
        setPaymentConfirmed(true);

        confirmButton.innerText = "Purchase Confirmed!";
        confirmButton.style.backgroundColor = 'green';

        setTimeout(() => {
            onClose();
        }, 2000);
    })
    .catch((error) => {
        confirmButton.innerText = "Purchase Failed!";
        confirmButton.style.backgroundColor = 'red';
    });
  }

  return (
    <div className="checkout-background" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="checkout-container">

        <h2>Checkout</h2>

        <table>
          <tbody>
            <tr>
              <td className="checkout-container-label">Delivery Information</td>
            </tr>
            <tr>
              <td className="checkout-label">Name:</td>
              <td className="checkout-value">{shopper ? `${shopper.FIRSTNAME} ${shopper.LASTNAME}` : "Guest"}</td>
            </tr>
            <tr>
              <td className="checkout-label">Email:</td>
              <td className="checkout-value">{shopper ? shopper.EMAIL : "Guest"}</td>
            </tr>
            <tr>
              <td className="checkout-label">Phone:</td>
              <td className="checkout-value">{shopper ? phoneNumber : "Guest"}</td>
            </tr>
            <tr>
              <td className="checkout-label">Location:</td>
              <td className="checkout-value">{shopper ? `${shopper.ADDRESS} ${shopper.CITY} ${shopper.STATE}, ${shopper.COUNTRY}` : "Guest"}</td>
            </tr>
            <tr>
              <td className='checkout-line-container' colSpan="2">
                  <hr className='checkout-line' />
              </td>
            </tr>
            <tr>
              <td className="checkout-container-label">Payment Amount</td>
            </tr>
            <tr>
              <td className="checkout-label">Subtotal:</td>
              <td className="checkout-value">${amount.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="checkout-label">Taxes:</td>
              <td className="checkout-value">${amount.taxAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td className='checkout-line-container' colSpan="2">
                  <hr className='checkout-line' />
              </td>
            </tr>
            <tr>
              <td className="checkout-label">Total:</td>
              <td className="checkout-value">${amount.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <button className="confirm-button" id="confirm" onClick={() => handleBasketCheckout()}>Confirm Purchase</button>
        <button className="cancel-button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
