import '../../styles/components/lists/ProductList.css';

import { useEffect, useState } from "react";

import { useCart } from '../../context/order.context';
import { useData } from '../../context/data.context';

import ProductCard from "../cards/ProductCard";

export default function ProductList({ search }) {
  const { products, setProducts } = useData();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setFilter(products);
      setLoading(false);
      return;
    }
  }, [products]);

  useEffect(() => {
    if (search === "") {
      setFilter(products);
    } else {
      const filteredProducts = products.filter(product => product.PRODUCTNAME.toLowerCase().includes(search.toLowerCase()));
      setFilter(filteredProducts);
    }
  }, [search, products]);

  const { cart, addItem, removeItem, clearCart } = useCart();

  const handleProduct = (id) => {
    try {
      // Find product by id
      const data = products.find(c => c.IDPRODUCT === id);

      if (!data) throw new Error("Product not found");

      addItem(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading products... This could take a minute</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="coffee-list-container">
      {filter.map((product, index) =>  <ProductCard key={index} product={product} handleProduct={handleProduct} />)}
    </div>
  );
}
