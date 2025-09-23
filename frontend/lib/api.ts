// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // if you're using cookies / auth
});

export default api;
