import GeneralComponent from "@/components/app/GeneralComponent";
import SettingsShell from "@/components/app/SettingsShell";
import { getCourseByCoursebookId, getUser, getUserCourses, getUserMemebershipByCourseId } from "@/lib/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function GeneralPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug: coursebookIdString } = params;


  // get user
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  const [courseData, courseDataError] = await getCourseByCoursebookId(coursebookIdString);

  if (!courseData) {
    console.error("Error fetching course data:", courseDataError);
    return;
  }
  
  const [member, memberError] = await getUserMemebershipByCourseId(user.id, courseData.id);
  if (!member) {
    console.error("Error fetching user membership:", memberError);
    return;
  }

  const [userCourses, userCoursesError] = await getUserCourses(user.id);
  if (!userCourses) {
    console.error("Error fetching user courses:", userCoursesError);
    return;
  }

  return (
    <SettingsShell
      user={user}
      allCourses={userCourses}
      course={courseData}
      title="General"
      description="Your team settings"
    >
      <GeneralComponent course={courseData} userMembership={member} />
    </SettingsShell>
  );
}
