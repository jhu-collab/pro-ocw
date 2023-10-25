import HomeCard from "@/components/app/HomeCard";
import Shell from "@/components/app/Shell";
import {
  getCourseByCoursebookId,
  getInviteForCourse,
  getUser,
  getUserCourses,
} from "@/lib/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TeamPage({
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

  const [currentCourse, currentCourseError] = await getCourseByCoursebookId(
    coursebookId
  );
  if (currentCourseError) {
    redirect("/signin");
  }

  if (currentCourse) {
    return (
      <Shell
        user={user}
        course={currentCourse}
        allCourses={coursesData}
        pageName="Home"
        subtitle="Your page for critical information and summaries"
      >
        <HomeCard />
      </Shell>
    );
  }

  // Check to see if the user has an invite for the course
  const [inviteData, _] = await getInviteForCourse(user.id, currentCourse!.id);
  if (inviteData) {
    redirect(`/invitation/${inviteData.id}`);
  }

  redirect("/start");
}
