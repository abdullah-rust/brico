import axios from "axios";

const api = axios.create({
  // Aapka backend URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://localhost/api",

  // Ye hai main cheez jo aapne mangi hai
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
