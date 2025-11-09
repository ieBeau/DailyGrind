import React from 'react';
import {Link} from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" className="nav-logo">
          The Daily Grind
        </a>
        <ul className="nav-menu">
            <li><Link to="/products" className="nav-link">Products</Link></li>
            <li><Link to="/about" className="nav-link">Basket</Link></li>
            <li><Link to="/contact" className="nav-link">Reports</Link></li>
            <li><Link to="/contact" className="nav-link">Tax Calculator</Link></li>
            <li><Link to="/contact" className="nav-link">Order Status</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;