import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import { ShopperProvider } from './context/shopper.context.jsx'
import { DataProvider } from './context/data.context.jsx'
import { BasketProvider } from './context/basket.context.jsx'


import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopperProvider>
      <DataProvider>
        <BasketProvider>
          <Router>
            <App />
          </Router>
        </BasketProvider>
      </DataProvider>
    </ShopperProvider>
  </StrictMode>,
)
