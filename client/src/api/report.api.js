
const SERVER_URL = import.meta.env.PROD ? import.meta.env.VITE_SERVER_URL : '';

const getBasketStatus = async (basketId) => {
    const res = await fetch(`${SERVER_URL}/api/report/status/${basketId}`,{
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(error => { throw new Error("Network error: " + error.message) });

    if (!res.ok) throw new Error("Failed to fetch basket status");
    return res.json();
};

const getTotalPurchases = async (shopperId) => {
    const res = await fetch(`${SERVER_URL}/api/report/total-purchases/${shopperId}`,{
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(error => { throw new Error("Network error: " + error.message) });

    if (!res.ok) throw new Error("Failed to fetch total purchases");
    return res.json();
};

export default { getBasketStatus, getTotalPurchases };