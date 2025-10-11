const API_BASE = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://dailygrind-server.onrender.com";

const getCoffees = async function () {
    const data = await fetch(`${API_BASE}/api/coffees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response)
    .catch(error => { throw new Error("Network error: " + error.message) });

    if (!data.ok) throw new Error("Failed to fetch coffees");

    return data.json();
};

const getCoffeeById = async function (id) {
    const data = await fetch(`${API_BASE}/api/coffees/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response)
    .catch(error => { throw new Error("Network error: " + error.message) });

    if (!data.ok) throw new Error("Failed to fetch coffee");

    return data.json();
};

export default { getCoffees, getCoffeeById };