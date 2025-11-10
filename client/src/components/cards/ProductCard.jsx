import "../../styles/components/cards/ProductCard.css";

export default function ProductCard({ product, handleProduct }) {
  return (
    <div className="product-card-container">
      <p>
        {product.PRODUCTNAME.charAt(0).toUpperCase() + product.PRODUCTNAME.slice(1).toLowerCase()} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(product.PRICE))}
      </p>

      <img src={product.PRODUCTIMAGE} alt={product.PRODUCTNAME} className="product-card-image" />

      <button onClick={() => handleProduct(product.IDPRODUCT)}>Select</button>
    </div>
  );
}
