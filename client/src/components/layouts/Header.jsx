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
            <div className='nav-container'>
                <Link to="/" className='nav-logo'>The Daily Grind</Link>
                <div className='nav-menu'>
                    <nav>
                        <Link to="/" className='nav-link'>Home</Link>
                        <Link to="/products" className='nav-link'>Products</Link>
                        <Link to="/product-management" className='nav-link'>Manage Products</Link>
                        <Link to="/basket" className='nav-link'>Basket</Link>
                        <Link to="/order" className='nav-link'>Order</Link>
                        <Link to="/reports" className='nav-link'>Reports</Link>
                        <Link to="/accounts" className='nav-link'>Accounts</Link>
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