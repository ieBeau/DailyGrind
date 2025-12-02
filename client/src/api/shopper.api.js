import { fetchApi } from "../utils/fetch";

export const getShoppers = async () => {
    const response =  await fetchApi(`/shopper`, {
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

export const getShopperById = async (id) => {
    const response = await fetchApi(`/shopper/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json())
    .catch(error => {
        console.error('Error:', error);
        return {};
    });

    return response;
};

export const getShopperTotalSpending = async (id) => {
    const response = await fetchApi(`/shopper/${id}/spending`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json())
    .catch(error => {
        console.error('Error:', error);
        return {};
    });

    return response;
};