import axios from "axios";

const rawBaseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
// If baseURL has /api/v1 suffix, strip it so calls like api.post('/api/v1/assess') resolve cleanly to http://localhost:8000/api/v1/assess
const baseURL = rawBaseURL.replace(/\/api\/v1\/?$/, "");

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
