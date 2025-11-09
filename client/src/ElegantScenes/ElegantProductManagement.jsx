import React, { useState, useEffect } from 'react';
import '../styles/Elegant.css';

// Product Management Component
const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({
        productName: '',
        description: '',
        image: '',
        price: '',
        stock: '',
        status: 1
    });

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Function to fetch products from the server
    const fetchProducts = async () => {
        try {
            const response = await fetch('https://dailygrind-server.onrender.com/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Function to handle updating product description
    const handleUpdateDescription = async () => {
        if (!selectedProduct || !newDescription) {
            alert('Please select a product and enter a new description.');
            return;
        }

        // Send update request to the server
        try { 
            const response = await fetch('https://dailygrind-server.onrender.com/api/update-product-description', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: selectedProduct,
                description: newDescription
            })
        });
            
            // Handle response
            if (response.ok) {
                alert('Product description updated successfully!');
                setNewDescription('');
                setSelectedProduct('');
                fetchProducts();  // Refresh product list
            } else {
                alert('Error updating product description.');
            }
        } catch (error) {
            console.error('Error: ', error);
            alert('Error updating product description.');
        }
    };

    // Function to handle adding a new product
    const handleAddProduct = async () => {
        try {
            const response = await fetch('https://dailygrind-server.onrender.com/api/add-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct)
            });

            // Handle response
            if (response.ok) {
                alert('Product added successfully!');
                setNewProduct({
                    productName: '',
                    description: '',
                    image: '',
                    price: '',
                    stock: '',
                    status: 1
                });
                fetchProducts();  // Refresh product list
            } else {
                alert('Error adding product.');
            }
        } catch (error) {
            console.error('Error: ', error);
            alert('Error adding product.'); 
        }
    };

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <div className="page-containter"> {/* Outer Page Container */}
        <div className="content-wrapper"> {/* Inner Content Wrapper */}
            <h1 className="heading-secondary center-text margin-bottom-large">Product Management</h1>

            {/* Update Product Description Section */}
            <div className="card margin-bottom-large">
                <div className="card-header">
                    <h2 className="heading-tertiary">Update Product Description</h2>
                </div>
                <div className="grid-layout two-column-grid">
                    <div className="form-group">
                        <label className="form-label">Select Product:</label>
                        <select className="form-select"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            >
                            <option value="">-- Select a product --</option>
                            {products.map((product) => (
                                <option key={product.productId} value={product.productId}>
                                    {product.productName}
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

            {/* Add New Product */}
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
                        <label className="form-label">Status:</label>
                        <select className="form-select"
                            value={newProduct.status}
                            onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                </div>
                    <button className="primary-button margin-top-large"onClick={handleAddProduct}>
                        Add Product
                    </button>                
                </div>  

                {/* Product List with Search */}
                <div className="card">
                    <div className="card-header flex-space-between">
                        <h2 className="heading-tertiary">Product List</h2>                
                        <div className="search-container">
                            <input className="form-input search-input"
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>              

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                            </tr>
                        </thead>  
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="no-products-message">
                                        {searchTerm
                                        ? 'No products match your search'
                                        : 'No products available. Add some products to get started.'
                                        }
                                    </td>   
                                </tr>   
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.idProduct || product.productId}>
                                        <td>{product.idProduct || product.productId}</td>
                                        <td className="product-name">{product.productName}</td>
                                        <td className="product-description">{product.description}</td>
                                    <td className="product-price">${product.price}</td>
                                    <td className="product-stock">{product.stock}</td>
                                    <td>
                                        <span className={product.status ===1 ? 'status-active' : 'status-inactive'}>
                                        {product.status === 1 ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            )))} 
                        </tbody>
                    </table>                    
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;