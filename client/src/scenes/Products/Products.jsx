import './Products.css';
import { useState, useEffect } from 'react';
import { addBasketItem, deleteBasketItem } from '../../api/basket.api';
import { useBasket } from '../../context/basket.context'; 
import { useAdmin } from '../../context/admin.context';
import { useData } from '../../context/data.context';
import { createProduct, deleteProductById, updateProductDescription } from '../../api/product.api';
import { useShopper } from '../../context/shopper.context';

export default function Products () {

  const { admin } = useAdmin();
  const { shopper } = useShopper();
  const { isLoading, products, setProducts, refreshProducts, baskets, handleBaskets } = useData();
  const { shoppingCart, setShoppingCart } = useBasket();

  const [searchTerm, setSearchTerm] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedProduct, setAddedProduct] = useState({});
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
      e.preventDefault();

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

  const handleQuantityChange = async (product, newQuantity) => {
    const productId = product.IDPRODUCT;
    newQuantity = Math.max(0, newQuantity);     
    
    setShoppingCart(prev => {
        const existingProduct = prev.products[productId];
        let updatedProducts = prev.products;
        if (existingProduct) {
          updatedProducts[productId] = { ...existingProduct, QUANTITY: newQuantity };
        } else {
          const productToAdd = products.find(p => p.IDPRODUCT === productId);
          updatedProducts[productId] = { ...productToAdd, QUANTITY: newQuantity };
      }
      return { ...prev, products: updatedProducts };
    });

    setAddedProduct(prev => ({ ...prev, [productId]: true }));
  };
  
  // Task 5: Add Basket Item
  useEffect(() => {
    if (Object.keys(addedProduct).length === 0) return;

    const timeout = setTimeout(() => {
      Object.entries(addedProduct).forEach(async ([productId, _]) => {
        const basketId = shoppingCart.basket.IDBASKET;
        const basketItem = shoppingCart.products[productId];
        const quantity = shoppingCart.products[productId].QUANTITY;

        if (quantity === 0) deleteBasketItem(basketId, basketItem.IDBASKETITEM);
        else addBasketItem(basketId, basketItem, quantity);

        if (quantity === 0) {
          const updatedProducts = { ...shoppingCart.products };
          delete updatedProducts[productId];
          setShoppingCart(prev => ({ ...prev, products: updatedProducts }));
        }
        
        // Update baskets quantity and items in Data Context
        const basketAddition = baskets.map(prevBasket => {
            if (prevBasket.IDBASKET === shoppingCart.basket.IDBASKET) {
                const basketQuantity = prevBasket.ITEMS.reduce((sum, bi) => {
                    if (bi.IDPRODUCT === basketItem.IDPRODUCT) return sum + quantity;
                    return sum + bi.QUANTITY;
                }, 0);

                if (quantity === 0) {
                  const filteredItems = prevBasket.ITEMS.filter(bi => bi.IDPRODUCT !== basketItem.IDPRODUCT);
                  return { ...prevBasket, QUANTITY: basketQuantity, ITEMS: filteredItems };
                } else {
                  const updatedItems = prevBasket.ITEMS.map(bi => {
                    if (bi.IDPRODUCT === basketItem.IDPRODUCT) return { ...bi, QUANTITY: quantity };
                    return bi;
                  });
                  return { ...prevBasket, QUANTITY: basketQuantity, ITEMS: updatedItems };
                }

            }
            return prevBasket;
        });
          
        handleBaskets(basketAddition);
      });

      setAddedProduct({});

    }, 1000);

    return () => clearTimeout(timeout);
  }, [addedProduct]);

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    await deleteProductById(productId)
    .then(() => {
        refreshProducts();
    });
  };

  const handleAddProductClose = () => {
    setNewProduct(defaultProduct);
    setShowAddModal(false);
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
                          className="remove-btn"
                          disabled={!shopper}
                          onClick={(e) => {
                            e.stopPropagation(); // ← Prevents modal from opening
                            handleQuantityChange(product, Math.max(0, (shoppingCart.products[product.IDPRODUCT]?.QUANTITY || 0) - 1));
                          }}
                        >
                          -  
                        </button>

                        <span className="quantity-display">
                          {shoppingCart.products[product.IDPRODUCT]?.QUANTITY || 0}
                        </span>

                        <button
                          className="add-btn"
                          disabled={!shopper}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(product, Math.min(99, (shoppingCart.products[product.IDPRODUCT]?.QUANTITY || 0) + 1));
                          }}
                        >
                          +
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

      {/* Update Product Description */}
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
                            value={selectedProduct?.IDPRODUCT || ""}
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
                            maxLength={100}
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

      {/* Add New Product */}
      {showAddModal && (
        <div className="popup-overlay" onClick={() => setShowAddModal(false)}>
          <form className="popup-message" onClick={(e) => e.stopPropagation()}  onSubmit={handleAddProduct}>                        
            <div className="card margin-bottom-large">
                <div className="card-header">
                    <h2 className="heading-tertiary">Add New Product</h2>
                </div>

                <div className="grid-layout two-column-grid">
                    <div className="form-group">
                        <label className="form-label">Product Name:</label>
                        <input className="form-input"
                            type="text"
                            maxLength={25}
                            value={newProduct.PRODUCTNAME}
                            onChange={(e) => setNewProduct({ ...newProduct, PRODUCTNAME: e.target.value })}
                            placeholder="Enter product name"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label">Description:</label>
                        <textarea className="form-textarea"
                            rows="3"
                            maxLength={100}
                            value={newProduct.DESCRIPTION}
                            onChange={(e) => setNewProduct({ ...newProduct, DESCRIPTION: e.target.value })}
                            placeholder="Enter product description"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image Filename:</label>
                        <input className="form-input"
                            type="text"
                            maxLength={25}
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
                            min="0"
                            max="9999.99"
                            maxLength={7}
                            value={newProduct.PRICE}
                            onChange={(e) => setNewProduct({ ...newProduct, PRICE: Math.min(9999.99, Math.max(0, e.target.value)) })}
                            placeholder="Enter product price"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Stock Quantity:</label>
                        <input className="form-input"
                            type="number"
                            min="0"
                            max="9999"
                            value={newProduct.STOCK}
                            onChange={(e) => setNewProduct({ ...newProduct, STOCK: Math.min(9999, Math.max(0, e.target.value)) })}
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
                    <button className="primary-button margin-top-large" type='submit'>
                        Add Product
                    </button>                
                </div>                
            <button className="primary-button margin-top-large" type='reset' onClick={handleAddProductClose}>Close</button>
          </form>
        </div>
      )}
    </div>
  );
}