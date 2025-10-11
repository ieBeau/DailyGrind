import '../../styles/components/layouts/Header.css';

import { Link } from 'react-router-dom';

export default function Header () {
    return (
        <div className='header'>
            <div className='header-title'>Daily Grind</div>

            <nav>
                <Link to="/">HOME</Link>
                <Link to="/coffee">COFFEE</Link>
            </nav>
        </div>
    )
}