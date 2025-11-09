import React from 'react';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header.jsx';
import ProductManagement from './scenes/ProductManagement.jsx';
import './styles/dailygrind.css';
import Hero from './components/Layout/Hero.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Hero />
        <Routes>
          <Route path="/" element={<ProductManagement />} />
          <Route path="/products" element={<ProductManagement />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;