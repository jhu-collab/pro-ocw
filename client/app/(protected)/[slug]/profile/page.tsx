import ProfileComponent from "@/components/app/ProfileComponent";
import SettingsShell from "@/components/app/SettingsShell";
import { getUser, getUserCourses } from "@/lib/server";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Profile({
  params,
}: {
  params: { slug: string };
}) {
  const { slug: coursebookId } = params;

  // get user
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }

  // get all the courses the user is a member of
  const [coursesData, coursesError] = await getUserCourses(user.id);
  if (coursesError) {
    redirect("/signin");
  }

  const course = coursesData.find((c) => c.coursebookId === coursebookId);
  if (!coursesData || !course) {
    return redirect("/signin");
  }
  console.log(user);

  return (
    <SettingsShell
      user={user}
      allCourses={coursesData}
      course={course}
      title="Profile"
      description="Manage your personal info"
    >
      <ProfileComponent user={user} />
    </SettingsShell>
  );
}
