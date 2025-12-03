import './App.css'
import './styles/DailyGrind.css'

import { Routes, Route } from "react-router-dom";

import Header from "./components/layouts/Header/Header.jsx";
import Home from "./scenes/Home/Home.jsx";
import Products from "./scenes/Products/Products.jsx";
import Basket from "./scenes/Basket/Basket.jsx";
import Orders from "./scenes/Orders/Orders.jsx";
import Reports from "./scenes/Reports/Reports.jsx";
import Accounts from "./scenes/Accounts/Accounts.jsx";

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/accounts" element={<Accounts />} />
      </Routes>
    </>
  )
}

export default App
