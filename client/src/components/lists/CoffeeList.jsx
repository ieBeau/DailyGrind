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

  const handleCoffee = (id) => {
    try {
      const data = coffees.find(c => c.EMPNO === id);
      alert(`Selected coffee: ${data.ENAME} - $${data.SAL}`);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading coffees...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="coffee-list-container">
      {coffees.map((coffee, index) =>  <CoffeeCard key={index} coffee={coffee} handleCoffee={handleCoffee} />)}
    </div>
  );
}
