import "../../styles/components/cards/CoffeeCard.css";

export default function CoffeeCard({ coffee, handleCoffee }) {
  return (
    <div className="coffee-card-container">
      <p>
        {coffee.PRODUCTNAME.charAt(0).toUpperCase() + coffee.PRODUCTNAME.slice(1).toLowerCase()} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(coffee.PRICE))}
      </p>

      <img src={coffee.PRODUCTIMAGE} alt={coffee.PRODUCTNAME} className="coffee-card-image" />

      <button onClick={() => handleCoffee(coffee.IDPRODUCT)}>Select</button>
    </div>
  );
}
