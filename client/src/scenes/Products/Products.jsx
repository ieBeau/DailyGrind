import './Products.css';
import { useState, useEffect } from 'react';
import { updateBasketItem } from '../../api/basket.api';
import { useBasket } from '../../context/basket.context'; 

export default function Products () {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartQuantities, setCartQuantities] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNoResultsPopup, setShowNoResultsPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    image: '',
    price: '',
    stock: '',
    active: 1
});

// Update Product Description
const handleUpdateDescription = async () => {
    if (!selectedProduct || !newDescription) {
        alert('Please select a product and enter a new description.');
        return;
    }
    
    try { 
        const currentProduct = products.find(p => p.IDPRODUCT == selectedProduct);
        const response = await fetch(`https://dailygrind-server.onrender.com/api/product/${selectedProduct}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                idProduct: parseInt(selectedProduct),
                productName: currentProduct.PRODUCTNAME,
                description: newDescription,
                productImage: currentProduct.IMAGE || 'default.jpg',
                price: currentProduct.PRICE,
                stock: currentProduct.STOCK || 0,
                active: currentProduct.ACTIVE
            })
        });
        
        if (response.ok) {
            alert('Product description updated successfully!');
            setNewDescription('');
            setSelectedProduct('');
            setShowUpdateModal(false);
            const response = await fetch('https://dailygrind-server.onrender.com/api/product');
            const data = await response.json();
            setProducts(data);
        } else {
            alert('Error updating product description.');   
        }
    } catch (error) {
        console.error('Error: ', error);
        alert('Error updating product description.');
    }
};

// Add New Product
const handleAddProduct = async () => {
    if (!newProduct.productName || !newProduct.description || !newProduct.price) {
        alert('Please fill in product name, description, and price.');
        return;
    }   

    try {
        const response = await fetch('https://dailygrind-server.onrender.com/api/product', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                productName: newProduct.productName,
                description: newProduct.description,
                productImage: newProduct.image || 'default.jpg',
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock) || 0,
                active: parseInt(newProduct.active)
            })
        });

        if (response.ok) {
            alert('Product added successfully!');
            setNewProduct({
                productName: '',
                description: '',
                image: '',
                price: '',
                stock: '',
                active: 1
            });
            setShowAddModal(false);
            const response = await fetch('https://dailygrind-server.onrender.com/api/product');
            const data = await response.json();
            setProducts(data);
        } else {
            alert('Error adding product.');
        }
    } catch (error) {
        console.error('Error: ', error);
        alert('Error adding product.'); 
    }
};

  const { shoppingCart } = useBasket();

  const handleQuantityChange = async (productId, newQuantity) => {
    const currentQty = cartQuantities[productId] || 0;
    newQuantity = Math.max(0, newQuantity);     
    
    setCartQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
    }));

    // Update basket via API
    const product = products.find(p => p.IDPRODUCT === productId);
    if (product && shoppingCart.basket) {
        await updateBasketItem(shoppingCart.basket, product, newQuantity);
    }
  };

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
                  <tr key={product.IDPRODUCT} onClick={() => setSelectedProduct(product)}>
                    <td>{product.IDPRODUCT}</td>
                    <td className="product-name">{product.PRODUCTNAME}</td>
                    <td className="product-description">{product.DESCRIPTION}</td>
                    <td className="product-price">${product.PRICE}</td>                    
                    <td>
                      <div className="quantity-controls">
                        <button
                          className="add-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(product.IDPRODUCT, (cartQuantities[product.IDPRODUCT] || 0) + 1);
                          }}
                        >
                          ADD
                        </button>
                        <span className="quantity-display">
                          {cartQuantities[product.IDPRODUCT] || 0}
                        </span>
                        <button 
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation(); // ← Prevents modal from opening
                            handleQuantityChange(product.IDPRODUCT, Math.max(0, (cartQuantities[product.IDPRODUCT] || 0) - 1));
                          }}
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
      {showUpdateModal && (
        <div className="popup-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="popup-message" onClick={(e) => e.stopPropagation()}>
            <h3>Update Product Description</h3>                          
            <div className="card margin-bottom-large">
                <div className="card-header">
                    <h2 className="heading-tertiary">Update Product Description</h2>
                </div>
                <div className="grid-layout two-column-grid">
                    <div className="form-group">
                        <label className="form-label">Select Product:</label>
                        <select className="form-select"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}>
                            <option value="">-- Select a product --</option>
                            {products.map((product) => (
                                <option key={product.IDPRODUCT} value={product.IDPRODUCT}>
                                  {product.PRODUCTNAME}
                              </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">New Description:</label>
                        <input className="form-input"
                            type="text"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Enter new description"
                        />
                    </div>
                </div>
                <button className="primary-button margin-top-large" onClick={handleUpdateDescription}>
                Update Description
                </button>
            </div>
            <button className="primary-button" onClick={() => setShowUpdateModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="popup-overlay" onClick={() => setShowAddModal(false)}>
          <div className="popup-message" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Product</h3>              
            <div className="card margin-bottom-large">
                <div className="card-header">
                    <h2 className="heading-tertiary">Add New Product</h2>
                </div>

                <div className="grid-layout two-column-grid">
                    <div className="form-group">
                        <label className="form-label">Product Name:</label>
                        <input className="form-input"
                            type="text"
                            value={newProduct.productName}
                            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                            placeholder="Enter product name"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Description:</label>
                        <textarea className="form-textarea"
                            rows="3"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            placeholder="Enter product description"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image Filename:</label>
                        <input className="form-input"
                            type="text"
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                            placeholder="Enter image filename"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Price:</label>
                        <input className="form-input"
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="Enter product price"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Stock Quantity:</label>
                        <input className="form-input"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            placeholder="Enter product stock"                            
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Active:</label>
                        <select className="form-select"
                            value={newProduct.active}
                            onChange={(e) => setNewProduct({ ...newProduct, active: e.target.value })}>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                </div>
                    <button className="primary-button margin-top-large"onClick={handleAddProduct}>
                        Add Product
                    </button>                
                </div>                
            <button className="primary-button" onClick={() => setShowAddModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}