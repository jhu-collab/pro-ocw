import { Course, User, Invite } from "@/types/types";
import { cookies } from "next/headers";
import axios from "axios";

// create axios instance
export const api = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// print request
api.interceptors.request.use((request) => {
  const token = cookies().get("token");
  if (token) {
    request.headers["Authorization"] = `Bearer ${token.value}`;
  }
  return request;
});

export async function getUser(): Promise<User | null> {
  try {
    const { data } = await api.get("/auth/current-user");
    return data;
  } catch (error) {
    return null;
  }
}

export async function getCourses(userId: string): Promise<[Course[], any]> {
  try {
    const { data } = await api.get(`/users/${userId}/courses`);
    return [data, null];
  } catch (error: any) {
    return [[], error];
  }
}

export async function getInvites(userId: string): Promise<[Invite[], any]> {
  try {
    const { data } = await api.get(`/users/${userId}/invites`);
    return [data, null];
  } catch (error: any) {
    return [[], error];
  }
}
