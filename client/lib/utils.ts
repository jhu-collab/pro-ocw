import { ROLE_INSTRUCTOR, ROLE_TA, ROLE_STUDENT } from "@/constants";
import { Role } from "@/types/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function roleToDisplay(role: Role) {
  return {
    [ROLE_INSTRUCTOR]: "Instructor",
    [ROLE_TA]: "Teaching Assistant",
    [ROLE_STUDENT]: "Student",
  }[role];
}
