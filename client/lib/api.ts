// API used by client components

import {
  BatchCreateInvite,
  Course,
  CreateCourse,
  UpdateCourse,
  UpdateMember,
  UpdateUser,
} from "@/types/types";
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

export async function acceptInvite(
  inviteId: string
): Promise<[Member | null, any]> {
  try {
    const { data } = await api.get(`/invites/${inviteId}/accept`);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function updateCourse(id: string, course: UpdateCourse) {
  try {
    const { data } = await api.put(`/courses/${id}`, course);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function deleteCourse(id: string) {
  try {
    const { data } = await api.delete(`/courses/${id}`);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function leaveCourse(userId: string, courseId: string) {
  try {
    const { data } = await api.delete(
      `/members/users/${userId}/courses/${courseId}`
    );
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function deleteInviteById(id: string) {
  try {
    const { data } = await api.delete(`/invites/${id}`);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function batchCreateInvite(batchCreateInvite: BatchCreateInvite) {
  try {
    const { data } = await api.post("/invites", batchCreateInvite);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function deleteMember(userId: string, courseId: string) {
  try {
    const { data } = await api.delete(
      `/members/users/${userId}/courses/${courseId}`
    );
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function updateMember(id: string, member: UpdateMember) {
  try {
    const { data } = await api.put(`/members/${id}`, member);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}
