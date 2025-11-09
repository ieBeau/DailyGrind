import React from 'react';
import heroImage from "../../assets/images/bowl-coffee-beans.jpg";

const ElegantHero = () => {
  return (
    <div 
      className="hero-section"
      style={{backgroundImage: `url(${heroImage})`}}
      >
        <div className="hero-overlay">
            <h1 className="hero-title">The Daily Grind</h1>
            <p className="hero-subtitle">Artisanal Coffee Experience</p>
            <button className="primary-button hero-cta">Explore Our Brews</button>
        </div>
    </div>
  );
};

export default ElegantHero;