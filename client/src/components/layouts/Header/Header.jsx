import './Header.css';
import { NavLink } from 'react-router-dom';
import { useAdmin } from '../../../context/admin.context.jsx';
import BasketQuantitySize from '../../misc/BasketQuantitySize/BasketQuantitySize.jsx';
import UserLogin from '../../misc/UserLogin/UserLogin.jsx';

export default function Header () {

    const { admin } = useAdmin();

    const handleActiveLink = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link';
    const handleActiveBasket = ({ isActive }) => isActive ? 'nav-link basket-link active' : 'nav-link basket-link';

    return (
        <div className='navbar'>
            <div className='nav-container'>
                {/* LEFT: Logo - switch to NavLink so the active route gets an active class */}
                <NavLink to="/" className={'nav-logo'}>
                    The Daily Grind
                </NavLink>

                {/* CENTER: Navigation - wrapped in proper container */}
                <nav className='nav-center'>
                    <NavLink to="/"  className={handleActiveLink}>Home</NavLink>
                    <NavLink to="/products"  className={handleActiveLink}>Products</NavLink>
                    <NavLink to="/orders"  className={handleActiveLink}>Orders</NavLink>
                </nav>
                
                {/* RIGHT: Admin + Basket - wrapped in proper container */}
                <div className='nav-right'>
                    {
                        admin && (
                            <>
                                <NavLink to="/reports"  className={handleActiveLink}>Reports</NavLink>
                                <NavLink to="/accounts"  className={handleActiveLink}>Accounts</NavLink>
                            </>
                        )
                    }
                    <NavLink to="/basket"  className={handleActiveBasket}>
                        Basket <span className="basket-count"><BasketQuantitySize /></span>
                    </NavLink>
                    
                    <UserLogin />
                </div>
            </div>
        </div>
    )
}