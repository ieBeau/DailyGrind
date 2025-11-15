import { useCart } from '../../context/order.context';
import '../../styles/components/layouts/Header.css';

import { Link, useNavigate } from 'react-router-dom';

export default function Header () {
    
    const navigate = useNavigate();
    
      const { cart, addItem, removeItem, clearCart } = useCart();
    
      const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const quantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    return (
        <div className='navbar'>
            <div className='header'>
                <Link to="/" className='nav-logo'>The Daily Grind</Link>

                <div className='nav-container'>
                    <nav>
                        <Link to="/">HOME</Link>
                        <Link to="/products">PRODUCTS</Link>
                        <Link to="/basket">BASKET</Link>
                        <Link to="/order">ORDER</Link>
                        <Link to="/reports">REPORTS</Link>
                        <Link to="/accounts">ACCOUNTS</Link>
                    </nav>

                    <div className='shopping-cart'>
                        <span>Qty: {quantity.toLocaleString()}</span>
                        <span>Total: {total.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}