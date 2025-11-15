import React from 'react';
import heroImage from "../../assets/images/bowl-coffee-beans.jpg";
import { Link } from 'react-router-dom';
import '../../styles/components/layouts/Hero.css';

const Hero = () => {
  return (
    <div 
      className="hero-section"
      style={{backgroundImage: `url(${heroImage})`}}
      >
        <div className="hero-overlay">
            <h1 className="hero-title">The Daily Grind</h1>
            <p className="hero-subtitle">Artisanal Coffee Experience</p>
            <Link to="/products" className="primary-button hero-cta">Explore Our Brews</Link>
        </div>
    </div>
  );
};

export default Hero;