import './Header.css';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../../context/admin.context.jsx';
import BasketQuantitySize from '../../misc/BasketQuantitySize/BasketQuantitySize.jsx';
import UserLogin from '../../misc/UserLogin/UserLogin.jsx';

export default function Header () {

    const { admin } = useAdmin();

    return (
        <div className='navbar'>
            <div className='nav-container'>
                {/* LEFT: Logo */}
                <Link to="/" className='nav-logo'>The Daily Grind</Link>
                
                {/* CENTER: Navigation - wrapped in proper container */}
                <nav className='nav-center'>
                    <Link to="/" className='nav-link'>Home</Link>
                    <Link to="/products" className='nav-link'>Products</Link>
                    <Link to="/orders" className='nav-link'>Orders</Link>
                </nav>
                
                {/* RIGHT: Admin + Basket - wrapped in proper container */}
                <div className='nav-right'>
                    {
                        admin && (
                            <>
                                <Link to="/product-management" className='nav-link'>Manage</Link>
                                <Link to="/reports" className='nav-link'>Reports</Link>
                                <Link to="/accounts" className='nav-link'>Accounts</Link>
                            </>
                        )
                    }
                    <Link to="/basket" className='nav-link'>
                        Basket <span className="basket-count"><BasketQuantitySize /></span>
                    </Link>
                    
                    <UserLogin />
                </div>
            </div>
        </div>
    )
}