import { fetchApi } from "../utils/fetch";
const defaultImage = "images/logos/daily-grind-logo.png";

export const getProducts = async () => {
    const response =  await fetchApi(`/product`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => data.map(product => {
        if (!product.PRODUCTIMAGE) return { ...product, PRODUCTIMAGE: defaultImage };
        return product;
    }))
    .catch(error => {
        console.error('Error:', error);
        return [];
    });

    return response;
};

export const createProduct = async (product) => {
    const data = await fetchApi(`/product`, {
        method: 'POST',
        body: product
    })
    .then(response => response)
    .catch(error => { throw new Error("Network error: " + error.message) });    

    if (!data.ok) throw new Error("Failed to create product");

    return data.json();
}

export const getProductById = async function (id) {
    const data = await fetchApi(`/product/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.PRODUCTIMAGE) return { ...data, PRODUCTIMAGE: defaultImage };
        return data;
    })
    .catch(error => { throw new Error("Network error: " + error.message) });

    if (!data.ok) throw new Error("Failed to fetch product");

    return data;
};

// Task 1: Update Product Description
export const updateProductDescription = async function (id, description) {
    if (!description) return;
    
    const data = await fetchApi(`/product/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to update product");
        return response.json();
    })
    .catch(error => { throw new Error("Network error: " + error.message) });
    return data;
}

export const deleteProductById = async function (idproduct) {
    const data = await fetchApi(`/product/${idproduct}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response)
    .catch(error => { throw new Error("Network error: " + error.message) });

    if (!data.ok) throw new Error("Failed to delete product");

    return data.json();
}