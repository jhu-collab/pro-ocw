import axios from "axios";

// create axios instance
export const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

