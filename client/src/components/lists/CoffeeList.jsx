import '../../styles/components/lists/CoffeeList.css';

import { useEffect, useState } from "react";

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

  const [shoppingCart, setShoppingCart] = useState({});

  const handleCoffee = (id) => {
    try {
      // Find coffee by id
      const data = coffees.find(c => c.EMPNO === id);

      if (!data) throw new Error("Coffee not found");

      // Update shopping cart
      setShoppingCart(prevCart => {
        const updatedCart = { ...prevCart };
        updatedCart[data.EMPNO] = (updatedCart[data.EMPNO] || 0) + 1;
        return updatedCart;
      });

      alert(`Selected coffee: ${data.ENAME} - $${data.SAL}`);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    console.log("Shopping Cart Updated:", shoppingCart);
  }, [shoppingCart]);

  if (loading) return <p>Loading coffees... This could take a minute</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="coffee-list-container">
      {coffees.map((coffee, index) =>  <CoffeeCard key={index} coffee={coffee} handleCoffee={handleCoffee} />)}
    </div>
  );
}
