import { fetchAuth } from "../utils/fetch";

export const login = async (userData) => {
    const response =  await fetchAuth(`/admin/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => data)
    .catch(error => {
        console.error('Error:', error);
        return {};
    });

    return response;
};

export const logout = async () => {
    const response = await fetchAuth(`/admin/signout`, {
        method: 'POST',
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

export const create = async (userData) => {
    const response = await fetchAuth(`/admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    }).then(res => res.json())
    .catch(error => {
        console.error('Error:', error);
        return {};
    });

    return response;
};