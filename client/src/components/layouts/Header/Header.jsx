import './Header.css';

import { Link } from 'react-router-dom';

import BasketQuantitySize from '../../misc/BasketQuantitySize/BasketQuantitySize.jsx';

export default function Header () {
    
    
    
    return (
        <div className='navbar'>
            <div className='nav-container'>
                <div className='nav-menu'>
                    <nav>
                        <Link to="/" className='nav-link'>Home</Link>
                        <Link to="/products" className='nav-link'>Products</Link>
                        <Link to="/basket" className='nav-link basket-size'>Basket <BasketQuantitySize /></Link>
                        <Link to="/orders" className='nav-link'>Orders</Link>

                        <Link to="/" className='nav-logo'>The Daily Grind</Link>

                        <Link to="/product-management" className='nav-link'>Manage Products</Link>
                        <Link to="/reports" className='nav-link'>Reports</Link>
                        <Link to="/accounts" className='nav-link'>Accounts</Link>
                    </nav>
                </div>
            </div>
        </div>
    )
}