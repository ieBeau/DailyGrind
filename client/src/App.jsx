import './styles/main/App.css'
import './styles/scenes/DailyGrind.css'

import { Routes, Route } from "react-router-dom";

import Header from "./components/layouts/Header";
import Home from "./scenes/Home";
import Coffee from "./scenes/Products";
import Products from "./scenes/products";
import Basket from "./scenes/basket";
import Order from "./scenes/order";
import Reports from "./scenes/reports";
import Accounts from "./scenes/accounts";

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/order" element={<Order />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/accounts" element={<Accounts />} />
      </Routes>
    </>
  )
}

export default App
