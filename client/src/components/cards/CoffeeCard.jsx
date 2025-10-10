import "../../styles/components/cards/CoffeeCard.css";

export default function CoffeeCard({ coffee, handleCoffee }) {
  return (
    <div className="coffee-card-container">
        <p>{coffee.ENAME.charAt(0).toUpperCase() + coffee.ENAME.slice(1).toLowerCase()} - ${coffee.SAL}</p>
        <button onClick={() => handleCoffee(coffee.EMPNO)}>Select</button>
    </div>
  );
}
