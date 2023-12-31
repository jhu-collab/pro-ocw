import MembersComponent from "@/components/app/MembersComponent";
import SettingsShell from "@/components/app/SettingsShell";
import {
  getCourseByCoursebookId,
  getInvitesByCourseId,
  getMembersByCourseId,
  getUser,
  getUserCourses,
  getUserMemebershipByCourseId,
} from "@/lib/server";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MembersPage({
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
  const [courseData, courseDataError] = await getCourseByCoursebookId(
    coursebookIdString
  );

  if (!courseData) {
    console.error("Error fetching course data:", courseDataError);
    return redirect("/start");
  }

  const [member, memberError] = await getUserMemebershipByCourseId(
    user.id,
    courseData.id
  );
  if (!member) {
    console.error("Error fetching user membership:", memberError);
    return redirect("/start");
  }

  // get all the members of the course
  const [membersData, membersDataError] = await getMembersByCourseId(
    courseData.id
  );
  if (!membersData) {
    console.error("Error fetching members data:", membersDataError);
    return redirect("/start");
  }

  const userMember = membersData.find((member) => member.userId === user.id);
  if (!userMember) {
    console.error("Error fetching user membership:", memberError);
    return redirect("/start");
  }

  // get all the invites of the team
  const [invitesData, invitesDataError] = await getInvitesByCourseId(
    courseData.id
  );
  if (!invitesData) {
    console.error("Error fetching invites data:", invitesDataError);
    return redirect("/start");
  }

  const [userCourses, userCoursesError] = await getUserCourses(user.id);
  if (!userCourses) {
    console.error("Error fetching user courses:", userCoursesError);
    return redirect("/start");
  }

  return (
    <SettingsShell
      user={user}
      allCourses={userCourses}
      course={courseData}
      title="Members"
      description={`Manage and invite course members`}
    >
      <MembersComponent
        course={courseData}
        user={user}
        courseMembers={membersData}
        courseInvites={invitesData}
        userMember={userMember}
      />
    </SettingsShell>
  );
}
