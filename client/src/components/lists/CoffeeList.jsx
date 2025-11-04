import '../../styles/components/lists/CoffeeList.css';

import { useEffect, useState } from "react";

// import { addToCart, viewCart } from '../../utils/shoppingCart';
import { useCart } from '../../context/order.context';

import coffee from "../../api/coffee.api";

import CoffeeCard from "../cards/CoffeeCard";

export default function CoffeeList() {
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCoffees() {
      try {
        const data = await coffee.getCoffees();
        setCoffees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCoffees();
  }, []);

  const { cart, addItem, removeItem, clearCart } = useCart();

  const handleCoffee = (id) => {
    try {
      // Find coffee by id
      const data = coffees.find(c => c.IDPRODUCT === id);

      if (!data) throw new Error("Coffee not found");

      addItem(data);

      console.log("Shopping Cart Updated:", cart);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading coffees... This could take a minute</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="coffee-list-container">
      {coffees.map((coffee, index) =>  <CoffeeCard key={index} coffee={coffee} handleCoffee={handleCoffee} />)}
    </div>
  );
}
