import "../../styles/components/cards/ProductCard.css";

export default function ProductCard({ product, updateProduct, deleteProduct }) {
  return (
    <div className="product-card-container">
      <p className="product-name">
        {product.PRODUCTNAME.charAt(0).toUpperCase() + product.PRODUCTNAME.slice(1).toLowerCase()} - {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(Number(product.PRICE))}
      </p>
      <img src={product.PRODUCTIMAGE} alt={product.PRODUCTNAME} className="product-card-image" />
      <div className="product-description">{product.DESCRIPTION || 'No description available.'}</div>

      <div className="buttons-group">
        <button className="update-button" onClick={() => updateProduct(product.IDPRODUCT)}>Update</button>
        <button className="delete-button" onClick={() => deleteProduct(product.IDPRODUCT)}>Delete</button>
      </div>
    </div>
  );
}
