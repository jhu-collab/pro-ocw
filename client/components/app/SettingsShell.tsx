import { Course, User } from "@/types/types";
import Shell from "./Shell";

export default function SettingsShell({
  allCourses,
  course,
  children,
  title,
  description,
  user,
}: {
  allCourses: Course[];
  course: Course;
  children: React.ReactNode;
  title: string;
  description: string;
  user: User;
}) {
  return (
    <Shell
      course={course}
      allCourses={allCourses}
      pageName="Settings"
      subpage={title}
      subtitle={description}
      childrenClassname="max-w-5xl"
      user={user}
    >
      <div className="mx-auto grid h-full w-full">
        <div className="py-4">{children}</div>
      </div>
    </Shell>
  );
}
