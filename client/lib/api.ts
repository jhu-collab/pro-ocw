// API used by client components

import { Course, CreateCourse, UpdateUser } from "@/types/types";
import axios from "axios";
import Cookies from "js-cookie";

// create axios instance
export const api = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((request) => {
  const token = Cookies.get("token");

  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }
  return request;
});

export async function createCourse(
  course: CreateCourse
): Promise<[Course | null, any]> {
  try {
    const { data } = await api.post("/courses", course);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function updateUser(
  userId: string,
  user: UpdateUser
): Promise<[any | null, any]> {
  try {
    const { data } = await api.put(`/users/${userId}`, user);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}
