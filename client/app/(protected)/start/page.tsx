import Start from "@/components/app/Start";
import {
  getCourses,
  getInvitedCourses,
  getInvites,
  getUser,
} from "@/lib/server";

export const revalidate = 0;

export const dynamic = "force-dynamic";

export default async function StartPage() {
  const user = await getUser();

  const [coursesData, coursesError] = await getCourses(user!.id);

  if (coursesError) {
    console.error("Error fetching courses", coursesError);
    return;
  }

  const [invitedCourses, invitedCoursesError] = await getInvitedCourses(
    user!.id
  );
  if (invitedCoursesError) {
    console.error("Error fetching invited courses:", invitedCoursesError);
    return;
  }
  const [invitesData, invitesError] = await getInvites(user!.id);
  if (invitesError) {
    console.error("Error fetching user invites:", invitesError);
    return;
  }

  return (
    <div className="h-screen">
      <Start
        courses={coursesData}
        invites={invitesData}
        coursesFromInvites={invitedCourses} // TODO: all the courses that the user has been invited to
      />
    </div>
  );
}
