import { fetchApi } from "../utils/fetch";

export const getBaskets = async () => {
    const response =  await fetchApi(`/basket`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    if (!response.ok) throw new Error("Failed to fetch baskets");

    return response.json();
};

export const createBasket = async () => {
    const response = await fetchApi(`/basket`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) throw new Error("Failed to create basket");

    return response.json();
};

export const getBasketItems = async function (basketId) {
    const response = await fetchApi(`/basket/${basketId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(error => { throw new Error("Network error: " + error.message) });

    return response;
};

// Task 5: Add Basket Item
export const addBasketItem = async (basketid, product, quantity) => {
    const response = await fetchApi(`/basket/${basketid}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "productid": product.IDPRODUCT,
            "price": product.PRICE,
            "quantity": quantity,
            "sizecode": 2,
            "formcode": 4
        })
    })
    .then(response => response.json())
    .catch(error => { throw new Error("Network error: " + error.message) });

    return response;
};

export const deleteBasketItem = async (basketId, basketItemId) => {
    const response = await fetchApi(`/basket/${basketId}/item/${basketItemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(error => { throw new Error("Network error: " + error.message) });
   
    return response;
};

// Task 4: Update Basket Shipping Status
export const updateBasketShippingStatus = async (basket, date, shipper, shipnum) => {
    const response = await fetchApi(`/basket/${basket.IDBASKET}/shipping`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "date": date,
            "shipper": shipper,
            "shipnum": shipnum 
        })
    })
    .then(response => response.json())
    .catch(error => { throw new Error("Network error: " + error.message) });

    return response;
};

// Report 1: Get Basket Item Status
export const getBasketItemStatus = async (basket) => {
    const response = await fetchApi(`/basket/${basket.IDBASKET}/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(error => { throw new Error("Network error: " + error.message) });

    return response;
};