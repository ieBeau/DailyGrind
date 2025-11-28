const SERVER_URL = import.meta.env.PROD
  ? import.meta.env.VITE_SERVER_URL || ""
  : "http://localhost:3000";

const API_BASE = "/api";
const AUTH_BASE = "/auth";

export const fetchApi = async (endpoint, options = {}) => {
  const url = `${SERVER_URL}${API_BASE}${endpoint}`;
  
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  return res;
};

export const fetchAuth = async (endpoint, options = {}) => {
  const url = `${SERVER_URL}${AUTH_BASE}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  return res;
};
