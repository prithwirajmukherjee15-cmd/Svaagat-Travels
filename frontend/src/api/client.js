import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("tc_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      const url = err.config?.url || "";
      // Only auto-logout on auth-check endpoints, let pages handle others
      if (url.includes("/auth/me")) {
        localStorage.removeItem("tc_token");
      }
    }
    return Promise.reject(err);
  }
);

export default client;
