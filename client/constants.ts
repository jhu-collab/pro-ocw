import { Semester } from "./types/types";

export const SEMESTERS: Semester[] = [
  "SPRING",
  "SUMMER",
  "FALL",
  "INTERSESSION",
];

export const ROLE_INSTRUCTOR = "INSTRUCTOR";
export const ROLE_STUDENT = "STUDENT";
export const ROLE_TA = "TA";
export type Role =
  | typeof ROLE_INSTRUCTOR
  | typeof ROLE_STUDENT
  | typeof ROLE_TA;
export const ROLES: Role[] = [ROLE_INSTRUCTOR, ROLE_TA, ROLE_STUDENT];
