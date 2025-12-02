import './Products.css';
import { useState, useEffect } from 'react';
import { updateBasketItem } from '../../api/basket.api';
import { useBasket } from '../../context/basket.context'; 
import { useAdmin } from '../../context/admin.context';
import { useData } from '../../context/data.context';
import { createProduct, deleteProductById, updateProductDescription } from '../../api/product.api';

export default function Products () {

  const { admin } = useAdmin();
  const { isLoading, products, setProducts, refreshProducts } = useData();
  const { shoppingCart } = useBasket();

  const [searchTerm, setSearchTerm] = useState("");
  const [cartQuantities, setCartQuantities] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const defaultProduct = {
    PRODUCTNAME: '',
    DESCRIPTION: '',
    PRODUCTIMAGE: '',
    PRICE: '',
    STOCK: '',
    ACTIVE: 1
  }
  const [newProduct, setNewProduct] = useState(defaultProduct);

  // Task 1: Update Product Description
  const handleUpdateDescription = async () => {
    if (!selectedProduct || !newDescription) {
        alert('Please select a product and enter a new description.');
        return;
    }

    await updateProductDescription(selectedProduct.IDPRODUCT, newDescription)
    .then(() => {
        setProducts(prevProducts => prevProducts.map(prod => 
            prod.IDPRODUCT === selectedProduct.IDPRODUCT
                ? { ...prod, DESCRIPTION: newDescription }
                : prod
        ));
        setNewDescription('');
        setSelectedProduct(null);
        setShowUpdateModal(false)
    })
    .catch((error) => {
        console.error('Error updating product description: ', error);
    });
    
  };

  // Task 2: Create New Product
  const handleAddProduct = async (e) => {
      if (!newProduct.PRODUCTNAME || !newProduct.DESCRIPTION || !newProduct.PRICE) {
          alert('Please fill in product name, description, and price.');
          return;
      }

      await createProduct(newProduct)
      .then(() => {
          refreshProducts();
          setNewProduct(defaultProduct);
          setShowAddModal(false);
      })
      .catch((error) => {
          console.error('Error adding product: ', error);
      });
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const currentQty = cartQuantities[productId] || 0;
    newQuantity = Math.max(0, newQuantity);     
    
    setCartQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
    }));

    // Update basket via API
    const product = products.find(p => p.IDPRODUCT === productId);
    if (product && shoppingCart.basket) await updateBasketItem(shoppingCart.basket, product, newQuantity);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    await deleteProductById(productId)
    .then(() => {
        refreshProducts();
    });
  };

  const filteredProducts = products.filter(product =>
    product.PRODUCTNAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.DESCRIPTION?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="loading">Loading products...</div>;

  return (
    <div className="products-page">
      <div className="content-wrapper">
        <div className="card margin-bottom-large wide-card">
          <div className="card-header flex-space-between">
            <h2 className="heading-secondary">Products List</h2>                
            <div className="search-container">
              <input 
                className="form-input search-input"
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {
            admin && (

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
            )
          }

          <div className="card wide-card">
            <table className="table">
              <thead>
                <tr>
                  <th style={{textAlign: 'center'}}>Product ID</th>
                  <th style={{textAlign: 'center'}}>Product Name</th>
                  <th style={{textAlign: 'center'}}>Description</th>
                  <th style={{textAlign: 'center'}}>Price</th>
                  <th style={{textAlign: 'center'}}>Quantity</th>
                  { admin && ( <th style={{textAlign: 'center'}}>Actions</th> )}
                </tr>
              </thead>  
              <tbody>
                {filteredProducts.map((product) => (                  
                  <tr key={product.IDPRODUCT} onClick={() => setSelectedProduct(product)}>
                    <td>{product.IDPRODUCT}</td>
                    <td className="product-name">{product.PRODUCTNAME}</td>
                    <td className="product-description">{product.DESCRIPTION}</td>
                    <td className="product-price">${product.PRICE.toFixed(2)}</td>                    
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
                    { admin && (
                      <td>
                        <button
                          className="primary-button admin-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.IDPRODUCT);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
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
            <div className="card margin-bottom-large">
                <div className="card-header">
                    <h2 className="heading-tertiary">Update Product Description</h2>
                </div>
                <div className="grid-layout two-column-grid">
                    <div className="form-group">
                        <label className="form-label">Select Product:</label>
                        <select className="form-select"
                            value={selectedProduct.IDPRODUCT || ""}
                            onChange={(e) => setSelectedProduct(products.find(p => p.IDPRODUCT === Number(e.target.value)))}>
                            <option value="">-- Select a product --</option>
                            {products.map((product) => (
                                <option key={product.IDPRODUCT} value={product.IDPRODUCT}>
                                  {product.PRODUCTNAME}
                              </option>
                            ))}
                        </select>
                    </div>
                    <fieldset>
                        <legend className="form-label">Current Description:</legend>
                        <div className="current-description-box">
                            {
                              selectedProduct
                                ? products.find(p => p.IDPRODUCT === selectedProduct.IDPRODUCT)?.DESCRIPTION
                                : 'Please select a product to see its current description.'
                            }
                        </div>
                    </fieldset>
                    <div className="form-group full-width">
                        <label className="form-label">New Product Description:</label>
                        <textarea className="form-textarea"
                            rows="3"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Enter product description"
                        />
                    </div>
                </div>
                <button className="primary-button margin-top-large" onClick={handleUpdateDescription}>
                  Update Description
                </button>
            </div>
            <button className="primary-button margin-top-large" onClick={() => setShowUpdateModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="popup-overlay" onClick={() => setShowAddModal(false)}>
          <div className="popup-message" onClick={(e) => e.stopPropagation()}>                        
            <div className="card margin-bottom-large">
                <div className="card-header">
                    <h2 className="heading-tertiary">Add New Product</h2>
                </div>

                <div className="grid-layout two-column-grid">
                    <div className="form-group">
                        <label className="form-label">Product Name:</label>
                        <input className="form-input"
                            type="text"
                            value={newProduct.PRODUCTNAME}
                            onChange={(e) => setNewProduct({ ...newProduct, PRODUCTNAME: e.target.value })}
                            placeholder="Enter product name"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Description:</label>
                        <textarea className="form-textarea"
                            rows="3"
                            value={newProduct.DESCRIPTION}
                            onChange={(e) => setNewProduct({ ...newProduct, DESCRIPTION: e.target.value })}
                            placeholder="Enter product description"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image Filename:</label>
                        <input className="form-input"
                            type="text"
                            value={newProduct.PRODUCTIMAGE}
                            onChange={(e) => setNewProduct({ ...newProduct, PRODUCTIMAGE: e.target.value })}
                            placeholder="Enter image filename"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Price:</label>
                        <input className="form-input"
                            type="number"
                            step="0.01"
                            value={newProduct.PRICE}
                            onChange={(e) => setNewProduct({ ...newProduct, PRICE: e.target.value })}
                            placeholder="Enter product price"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Stock Quantity:</label>
                        <input className="form-input"
                            type="number"
                            value={newProduct.STOCK}
                            onChange={(e) => setNewProduct({ ...newProduct, STOCK: e.target.value })}
                            placeholder="Enter product stock"                            
                        />
                    </div>

                    <div className="form-group">  
                        <label className="form-label">Active:</label>
                        <select className="form-select"
                            value={newProduct.ACTIVE}
                            onChange={(e) => setNewProduct({ ...newProduct, ACTIVE: e.target.value })}>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                </div>
                    <button className="primary-button margin-top-large" onClick={handleAddProduct}>
                        Add Product
                    </button>                
                </div>                
            <button className="primary-button margin-top-large" onClick={() => setShowAddModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}