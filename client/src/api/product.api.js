const getProducts = async function () {
    const data = await fetch(`/api/product`, {
        method: 'GET',
        credentials: 'include',
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
    const data = await fetch(`/api/product/${id}`, {
        method: 'GET',
        credentials: 'include',
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