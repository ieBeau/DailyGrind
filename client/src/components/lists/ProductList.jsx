import '../../styles/components/lists/ProductList.css';

import { useEffect, useState } from "react";

// import { addToCart, viewCart } from '../../utils/shoppingCart';
import { useCart } from '../../context/order.context';

import product from "../../api/product.api";

import ProductCard from "../cards/ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await product.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const { cart, addItem, removeItem, clearCart } = useCart();

  const handleProduct = (id) => {
    try {
      // Find product by id
      const data = products.find(c => c.IDPRODUCT === id);

      if (!data) throw new Error("Product not found");

      addItem(data);

      console.log("Shopping Cart Updated:", cart);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading products... This could take a minute</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="coffee-list-container">
      {products.map((product, index) =>  <ProductCard key={index} product={product} handleProduct={handleProduct} />)}
    </div>
  );
}
