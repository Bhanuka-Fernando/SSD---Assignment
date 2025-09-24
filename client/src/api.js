import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8070",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const tok = localStorage.getItem("token");
  if (tok) config.headers.Authorization = `Bearer ${tok}`;
  return config;
});

// Optional: kick to login on 401/403
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("type");
      // redirect to login (adjust route as needed)
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;