import './styles/main/App.css'

import { Routes, Route } from "react-router-dom";

import Home from "./scenes/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
