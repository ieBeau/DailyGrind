import '../styles/scenes/Products.css';
import { useCart } from '../context/order.context';
import { useState, useEffect } from 'react';
import Header from '../components/layouts/Header.jsx';

export default function Product() {
  const { cart, addItem, removeItem } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cartQuantities, setCartQuantities] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNoResultsPopup, setShowNoResultsPopup] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    const currentQty = cartQuantities[productId] || 0;
    newQuantity = Math.max(0, newQuantity); 
    
    
    setCartQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
  }));

  const difference = newQuantity - currentQty;
  const product = products.find(p => p.IDPRODUCT === productId);

    if (difference > 0) {
    // Add items to cart
    for (let i = 0; i < difference; i++) {
      addItem(product);
    }
  } else if (difference < 0) {
    // Remove items from cart
    for (let i = 0; i < Math.abs(difference); i++) {
      removeItem({ IDPRODUCT: productId }); 
    }
  }
};

  const handleAddToCart = (product) => {
    const quantity = parseInt(cartQuantities[product.IDPRODUCT]) || 0;

    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dailygrind-server.onrender.com/api/product');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

    // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.PRODUCTNAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.DESCRIPTION?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (searchTerm && filteredProducts.length === 0) {
        setShowNoResultsPopup(true);
        const timer = setTimeout(() => setShowNoResultsPopup(false), 3000);
        return () => clearTimeout(timer);
    } else {
        setShowNoResultsPopup(false);
  }
}, [searchTerm, filteredProducts]);

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="products-page">
        <div className="page-container">
                <div className="content-wrapper">
                    <div className="card margin-bottom-large wide-card">
                        <div className="card-header flex-space-between">
                            <h2 className="heading-secondary">Products List</h2>                
                            <div className="search-container">
                            <input 
                                className="form-input search-input"
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {showNoResultsPopup && (
                            <div className="popup-overlay">
                                <div className="popup-message">
                                <h3>No Products Found</h3>
                                <p>No products match your search for "{searchTerm}"</p>
                                <button 
                                    className="primary-button" 
                                    onClick={() => {
                                        setShowNoResultsPopup(false);
                                        setSearchTerm("");                                    
                                }}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Admin actions */}
                    <div className="card margin-bottom-large wide-card admin-actions">
                        <div className="card-header">
                            <h3 className="heading-tertiary">Admin Actions</h3>
                        </div>
                            <div className="flex-layout gap-16 admin-buttons">
                                <button className="primary-button admin-btn" onClick={() => setShowUpdateModal(true)}>
                                    Update Product Description                    
                                </button>
                                <button className="primary-button" onClick={() => setShowAddModal(true)}>
                                    Add New Product                    
                                </button>   
                            </div>
                        </div> 

                    {/* Product Table */}
                    <div className="card wide-card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{textAlign: 'center'}}>Product ID</th>
                                <th style={{textAlign: 'center'}}>Product Name</th>
                                <th style={{textAlign: 'center'}}>Description</th>
                                <th style={{textAlign: 'center'}}>Price</th>
                                <th style={{textAlign: 'center'}}>Quantity</th>
                            </tr>
                        </thead>  
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.IDPRODUCT}>
                                    <td>{product.IDPRODUCT}</td>
                                    <td className="product-name">{product.PRODUCTNAME}</td>
                                    <td className="product-description">{product.DESCRIPTION}</td>
                                    <td className="product-price">${product.PRICE}</td>
                                    <td>
                                        <div className="quantity-controls">
                                        <button
                                            className="add-btn"
                                            onClick={() => handleQuantityChange(product.IDPRODUCT, (cartQuantities[product.IDPRODUCT] || 0) + 1)}
                                            >
                                                ADD
                                        </button>

                                            <span className="quantity-display">
                                                {cartQuantities[product.IDPRODUCT] || 0}
                                            </span>

                                            <button 
                                                className="remove-btn"
                                                onClick={() => handleQuantityChange(product.IDPRODUCT, Math.max(0, (cartQuantities[product.IDPRODUCT] || 0) - 1))}
                                            >
                                                REMOVE  
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
