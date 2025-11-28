import { fetchApi } from "../utils/fetch";

export const getProducts = async () => {
    const response =  await fetchApi(`/product`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => {
        console.error('Error:', error);
        return [];
    });

    return response;
};

export const getProductById = async function (id) {
    const data = await fetchApi(`/product/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(error => { throw new Error("Network error: " + error.message) });

    if (!data.ok) throw new Error("Failed to fetch coffee");

    return data;
};