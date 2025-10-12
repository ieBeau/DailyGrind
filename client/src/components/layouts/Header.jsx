import '../../styles/components/layouts/Header.css';

import { Link, useNavigate } from 'react-router-dom';

export default function Header () {
    
    const navigate = useNavigate();
    
    return (
        <div className='header'>
            <div className='header-title' onClick={() => navigate('/')}>☕ Daily Grind</div>

            <nav>
                <Link to="/">HOME</Link>
                <Link to="/coffee">COFFEE</Link>
            </nav>
        </div>
    )
}