import axios from "axios";
import { AuthService } from "./AuthService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Request Interceptor ---
api.interceptors.request.use(
  async (config) => {
    const accessToken = await AuthService.getToken("access_token");
    const refreshToken = await AuthService.getToken("refresh_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 matlab Access Token expire ho gaya
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AuthService.getToken("refresh_token");

        // Agar refresh token storage mein hi nahi hai, toh seedha logout
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/refresh`,
          {},
          { headers: { "x-refresh-token": refreshToken } }
        );

        const { accessToken } = refreshRes.data;

        // Naya Access Token save karo
        await AuthService.setToken("access_token", accessToken);

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // --- REFRESH TOKEN EXPIRED LOGIC ---
        // Agar yahan error aaya, iska matlab Refresh Token expire ya invalid ho chuka hai
        processQueue(refreshError, null);

        // 1. Storage Clean Karo
        await AuthService.clearToken("access_token");
        await AuthService.clearToken("refresh_token");

        // 2. User ko Welcome page par bhej do (Session Expired)
        // replace: true isliye taake user back button se wapis purane page par na ja sake
        window.location.href = "/welcome";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
