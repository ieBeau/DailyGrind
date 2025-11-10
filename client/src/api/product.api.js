const API_BASE = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://dailygrind-server.onrender.com";

const getProducts = async function () {
    const data = await fetch(`${API_BASE}/api/products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response)
    .catch(error => { throw new Error("Network error: " + error.message) });

    if (!data.ok) throw new Error("Failed to fetch products");

    return data.json();
};

const getProductById = async function (id) {
    const data = await fetch(`${API_BASE}/api/products/${id}`, {
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

export default { getProducts, getProductById };