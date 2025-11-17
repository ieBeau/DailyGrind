import React, { useState, useEffect } from 'react';
import '../styles/scenes/DailyGrind.css';

// Mock data for demo purposes
const mockProducts = [
    {
        idProduct: 1,
        productName: "Espresso Roast",
        description: "Strong and bold espresso blend.",
        price: 12.99,
        stock: 100,
        active: 1
    },
    {
        idProduct: 2,
        productName: "Columbian Supreme",
        description: "Smooth and balanced medium roast.",
        price: 14.50,
        stock: 80,
        active: 1
    },
    {
        idProduct: 3,
        productName: "French Vanilla",
        description: "Sweet vanilla flavoured coffee.",
        price: 13.75,
        stock: 50,
        active: 1
    }
];

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
        active: 1
    });

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            const response = await fetch('https://dailygrind-server.onrender.com/api/product');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Could not connect to backend. Using demo data.');  // Alert user about demo data usage
            setProducts(mockProducts); 
        }
    };

    // Update Product Description
    const handleUpdateDescription = async () => {
        if (!selectedProduct || !newDescription) {
            alert('Please select a product and enter a new description.');
            return;
        }
        
        try { 
            const currentProduct = products.find(p => p.idProduct == selectedProduct);


            const response = await fetch(`https://dailygrind-server.onrender.com/api/product/${selectedProduct}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                    body: JSON.stringify({
                        idProduct: parseInt(selectedProduct),
                        productName: currentProduct.productName,
                        description: newDescription,
                        productImage: currentProduct.image || 'default.jpg',
                        price: currentProduct.price,
                        stock: currentProduct.stock || 0,
                        active: currentProduct.active
                    })
                });
            
            // Handle response
            if (response.ok) {
                alert('Product description updated successfully!');
                setNewDescription('');
                setSelectedProduct('');
                fetchProducts();
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productName: newProduct.productName,
                    description: newProduct.description,
                    productImage: newProduct.image || 'default.jpg',
                    price: parseFloat(newProduct.price),
                    stock: parseInt(newProduct.stock) || 0,
                    active: parseInt(newProduct.active)
                })
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
                    active: 1
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
    <div className="page-container"> {/* Outer Page Container */}
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
                            onChange={(e) => setSelectedProduct(e.target.value)}>
                            <option value="">-- Select a product --</option>
                            {products.map((product) => (
                                <option key={product.idProduct} value={product.idProduct}>
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
                                <th>Active</th>
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
                                    <tr key={product.idProduct}>
                                        <td>{product.idProduct}</td>
                                        <td className="product-name">{product.productName}</td>
                                        <td className="product-description">{product.description}</td>
                                        <td className="product-price">${product.price}</td>
                                        <td className="product-stock">{product.stock}</td>
                                    <td>
                                        <span className={product.active ===1 ? 'status-active' : 'status-inactive'}>
                                        {product.active === 1 ? 'Active' : 'Inactive'}
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