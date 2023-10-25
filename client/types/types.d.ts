export type Semester = "FALL" | "SPRING" | "SUMMER" | "INTERSESSION";
export type Role = "INSTRUCTOR" | "STUDENT" | "TA";

export interface User {
  id: string;
  email: string;
  fullName: string;
  metadata: any;
  hasOnboarded: string;
}

export interface Course {
  id: string;
  createdAt: string;
  stripeCustomerId: string;
  subscribed: boolean;
  name: string;
  coursebookId: string;
  semester: Semester;
  year: number;
  courseCode: string;
}

export interface Invite {
  id: string;
  createdAt: string;
  role: Role;
  joined: boolean;
  email: string;  
  send: boolean;
  userId: string;
  courseId: string;
}
