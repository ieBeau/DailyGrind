import { fetchApi } from "../utils/fetch";

export const getOrderTax = async (state, subtotal) => {
    const response =  await fetchApi(`/tax/${state}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subtotal })
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => {
        console.error('Error:', error);
        return [];
    });

    return response;
};