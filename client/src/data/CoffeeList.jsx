import { useEffect, useState } from "react";

function CoffeeList() {
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCoffees() {
      try {
        const res = await fetch("http://localhost:3000/api/coffees");
        if (!res.ok) throw new Error("Failed to fetch coffees");
        const data = await res.json();

        setCoffees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCoffees();
  }, []);

  if (loading) return <p>Loading coffees...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">☕ Coffee Menu</h2>
      <div className="space-y-2">
        {coffees.map(coffee => (
          <div key={coffee.empno} className="border rounded-lg p-2 shadow-sm">
            <p className="font-semibold">{coffee.ENAME.charAt(0).toUpperCase() + coffee.ENAME.slice(1).toLowerCase()} - ${coffee.SAL}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoffeeList;
