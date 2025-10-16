import '../styles/scenes/Coffee.css';

import CoffeeList from "../components/lists/CoffeeList";
import { useCart } from '../context/order.context';

export default function Coffee () {
    
  const { cart, addItem, removeItem, clearCart } = useCart();

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className='coffee'>
            
            <h2 className='coffee-menu-title'>Coffee Menu</h2>

            <h3>Quantity: {quantity.toLocaleString('en-CA')} | Total: {total.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</h3>
            
            <CoffeeList />
            
        </div>
    )
}