import InviteComponent from "@/components/app/InviteComponent";
import {
  getInviteById,
  getUser,
} from "@/lib/server";
import { redirect } from "next/navigation";

export const revalidate = 0;

export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug: inviteIdString } = params;

  // get user
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }
  // console.log("user: ", user);

  // get the invite data
  const [inviteData, _] = await getInviteById(inviteIdString);

  if (!inviteData || !inviteData.course) {
    redirect("/signin");
  }

  // console.log("inviteData: ", inviteData);

  // Invitation email check
  const email = inviteData.email;

  if (email !== user.email) {
    redirect("/signin");
  }
  // console.log("email: ", email);

  return (
    <div className="h-screen">
      <InviteComponent
        course={inviteData.course}
        user={user}
        invite={inviteData}
      />
    </div>
  );
}
