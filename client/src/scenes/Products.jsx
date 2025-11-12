import '../styles/scenes/Products.css';

import ProductList from "../components/lists/ProductList";
import { useCart } from '../context/order.context';
import { useState } from 'react';

export default function Product () {
    
  const { cart, addItem, removeItem, clearCart } = useCart();

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className='product-list-page'>
            
            <h2 className='menu-title'>Products</h2>
                
            <h3>Quantity: {quantity.toLocaleString('en-CA')} | Total: {total.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}</h3>
                <div className="search-container">
                    <input className="form-input search-input"
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="primary-button margin-top-large" >
                    Update Product Description
                </button>
                <button className="primary-button margin-top-large" >
                    Add Product
                </button>    

            
            <ProductList search={searchTerm} />
            
        </div>
    )
}