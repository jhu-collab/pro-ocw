import { getCourseByCoursebookId, getUser } from "@/lib/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

function getCoursebookId(pathname: string) {
  // course book id is the second path segment
  const pathSegments = pathname.split("/");
  return pathSegments[2] || null;
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  // get route path
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const coursebookId = getCoursebookId(pathname);
  if (!coursebookId) {
    return <div>Coursebook not found</div>;
  }
  const [course, courseError] = await getCourseByCoursebookId(coursebookId);
  if (!course || courseError) {
    // user is not a member of this course or course not found
    return <div>Course not found</div>;
  }

  return <div>{children}</div>;
}
