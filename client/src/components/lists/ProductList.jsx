import '../../styles/components/lists/ProductList.css';
import '../../styles/components/cards/ProductCard.css';
import ProductCard from "../cards/ProductCard";
import { useEffect, useState } from "react";
import { useCart } from '../../context/order.context';
import { useData } from '../../context/data.context';

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
      const filteredProducts = products.filter(product => product.PRODUCTNAME?.toLowerCase().includes(search.toLowerCase()));
      setFilter(filteredProducts);
    }
  }, [search, products]);

  const { cart, addItem, removeItem, clearCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const openInfo = (product) => setSelectedProduct(product);
  const closeInfo = () => setSelectedProduct(null);

  const handleProduct = (product) => {
    try {
      if (!product) throw new Error("Product not found");

      addItem(product);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading products... This could take a minute</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="coffee-list-container">
      <table className="coffee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filter.map(product => (
            <tr key={product.IDPRODUCT}>
              <td>{product.IDPRODUCT}</td>
              <td className="product-name">{product.PRODUCTNAME}</td>
              <td className="product-price">{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(Number(product.PRICE))}</td>
              <td className="product-stock">{product.STOCK}</td>
              <td>
                <button className="more-info-button" onClick={() => openInfo(product)}>Info</button>
                <button className="add-button" onClick={() => handleProduct(product)}>Add</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeInfo}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeInfo} aria-label="Close">×</button>
            <ProductCard product={selectedProduct} handleProduct={handleProduct} />
          </div>
        </div>
      )}
    </div>
  );
}
