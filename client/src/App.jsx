import './styles/main/App.css'

import { Routes, Route } from "react-router-dom";

import Header from "./components/layouts/Header";
import Home from "./scenes/Home";
import Coffee from "./scenes/Coffee";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coffee" element={<Coffee />} />
      </Routes>
    </>
  )
}

export default App
