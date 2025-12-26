// src/services/api.ts
import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { AuthService } from "./AuthService";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
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

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const data = error.response?.data;

    // CASE 1: Access Token Expired - Yahan sirf refresh try karna hai
    if (
      status === 401 &&
      data?.code === "ACCESS_TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        try {
          const newToken = await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      refreshPromise = (async () => {
        try {
          const refreshToken = await AuthService.getToken("refresh_token");
          if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");

          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/refresh`,
            {},
            {
              headers: { "x-refresh-token": refreshToken },
            }
          );

          const { accessToken } = res.data;
          await AuthService.setToken("access_token", accessToken);
          return accessToken;
        } catch (err) {
          // Agar refresh request hi fail ho jaye (e.g. 403 ya 401 from /refresh)
          await AuthService.clearToken("access_token");
          await AuthService.clearToken("refresh_token");
          window.location.href = "/welcome";
          throw err;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();

      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    }

    // CASE 2: Refresh Token Invalid / Session Expired
    // Yeh tab chalega jab backend saaf keh de ke refresh token expire hai (403)
    if (
      status === 403 ||
      (status === 401 && data?.message === "Refresh token invalid")
    ) {
      await AuthService.clearToken("access_token");
      await AuthService.clearToken("refresh_token");
      window.location.href = "/welcome";
    }

    return Promise.reject(error);
  }
);

export default api;
