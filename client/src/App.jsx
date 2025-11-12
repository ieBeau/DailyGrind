import './styles/main/App.css'
import './styles/scenes/DailyGrind.css'

import { Routes, Route } from "react-router-dom";

import Header from "./components/layouts/Header";
import Home from "./scenes/Home";
import Products from "./scenes/Products";
import Basket from "./scenes/Basket";
import Order from "./scenes/Order";
import Reports from "./scenes/Reports";
import Accounts from "./scenes/Accounts";

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
