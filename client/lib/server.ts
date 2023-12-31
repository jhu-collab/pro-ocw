import { Course, User, Invite, Member, InviteLink } from "@/types/types";
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

export async function getInviteById(
  inviteId: string
): Promise<[Invite | null, any]> {
  try {
    const { data } = await api.get(`/invites/${inviteId}`);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function getInvitedCourses(
  userId: string
): Promise<[Course[], any]> {
  try {
    const { data } = await api.get(`/users/${userId}/invited-courses`);
    return [data, null];
  } catch (error: any) {
    return [[], error];
  }
}

export async function getUserCourses(userId: string): Promise<[Course[], any]> {
  try {
    const { data } = await api.get(`/users/${userId}/courses`);
    return [data, null];
  } catch (error: any) {
    return [[], error];
  }
}

export async function getInviteForCourse(
  userId: string,
  courseId: string
): Promise<[Invite | null, any]> {
  try {
    const { data } = await api.get(
      `/courses/${courseId}/invites/users/${userId}`
    );
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function getCourseByCoursebookId(
  coursebookId: string
): Promise<[Course | null, any]> {
  try {
    const { data } = await api.get(`/courses?coursebookId=${coursebookId}`);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function getCourseById(
  couseId: string
): Promise<[Course | null, any]> {
  try {
    const { data } = await api.get(`/courses/${couseId}`);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function getUserMemebershipByCourseId(
  userId: string,
  courseId: string
): Promise<[Member | null, any]> {
  try {
    const { data } = await api.get(
      `/members/users/${userId}/courses/${courseId}`
    );
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}

export async function getMembersByCourseId(
  courseId: string
): Promise<[Member[], any]> {
  try {
    const { data } = await api.get(`/courses/${courseId}/members`);
    return [data, null];
  } catch (error: any) {
    return [[], error];
  }
}

export async function getUsersByCourseId(
  courseId: string
): Promise<[User[], any]> {
  try {
    const { data } = await api.get(`/courses/${courseId}/users`);
    return [data, null];
  } catch (error: any) {
    return [[], error];
  }
}

export async function getInvitesByCourseId(
  courseId: string
): Promise<[Invite[], any]> {
  try {
    const { data } = await api.get(`/courses/${courseId}/invites`);
    return [data, null];
  } catch (error: any) {
    return [[], error];
  }
}

export async function getInviteLinkById(
  inviteLinkId: string
): Promise<[InviteLink | null, any]> {
  try {
    const { data } = await api.get(`/invite-links/${inviteLinkId}`);
    return [data, null];
  } catch (error: any) {
    return [null, error];
  }
}
