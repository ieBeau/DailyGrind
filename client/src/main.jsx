import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import { CustomerProvider } from './context/customer.context.jsx'
import { DataProvider } from './context/data.context.jsx'
import { CartProvider } from './context/order.context.jsx'

import './styles/main/index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomerProvider>
      <DataProvider>
        <CartProvider>
          <Router>
            <App />
          </Router>
        </CartProvider>
      </DataProvider>
    </CustomerProvider>
  </StrictMode>,
)
