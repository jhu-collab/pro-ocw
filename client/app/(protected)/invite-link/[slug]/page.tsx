import InviteLinkComponent from "@/components/app/InviteLinkComponent";
import { getInviteLinkById, getUser } from "@/lib/server";
import { notFound, redirect } from "next/navigation";

export const revalidate = 0;

export const dynamic = "force-dynamic";

export default async function InviteLinkPage({
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

  // get the invite data
  const [inviteLinkData, _] = await getInviteLinkById(inviteIdString);

  if (!inviteLinkData || !inviteLinkData.course) {
    notFound();
  }

  return (
    <div className="h-screen">
      <InviteLinkComponent
        course={inviteLinkData!.course}
        user={user}
        inviteLink={inviteLinkData}
      />
    </div>
  );
}
