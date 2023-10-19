import Start from "@/components/app/Start";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const revalidate = 0;

export const dynamic = "force-dynamic";

export default async function StartPage() {
  // setup supabase
  const supabase = createServerComponentClient({ cookies });

  // get user

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // get user profile

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // if user has not onboarded, redirect to onboarding

  if (!profile.has_onboarded) {
    redirect(`/onboarding`);
  }

  const email = user.email;

  // get the teams the user is a member of

  // const { data: teams } = await supabase.from("teams").select("*");

  // get the team IDs the user is a member of
  const { data: membershipsData, error: membershipsError } = await supabase
    .from("members")
    .select("team_id")
    .eq("user_id", user.id);

  if (membershipsError) {
    console.error("Error fetching user team memberships:", membershipsError);
    return;
  }

  // Extract the team IDs from the result
  const teamIds = membershipsData.map((membership) => membership.team_id);

  // Fetch the teams using the team IDs
  const { data: teamsData, error: teamsError } = await supabase
    .from("teams")
    .select("*")
    .in("id", teamIds);

  if (teamsError) {
    console.error("Error fetching teams:", teamsError);
    return;
  }

  if (!teamsData) {
    redirect("/signin");
  }

  // Get invites for the user

  const { data: invitesData, error: invitesError } = await supabase
    .from("invites")
    .select("*")
    .eq("email", email);

  if (invitesError) {
    console.error("Error fetching user invites:", invitesError);
    return;
  }

  if (!invitesData) {
    redirect("/signin");
  }

  // Extract the team IDs from the result

  const teamIdsFromInvites = invitesData.map((invite) => invite.team_id);

  // Fetch the teams using the team IDs

  const { data: teamsDataFromInvites, error: teamsErrorFromInvites } =
    await supabase.from("teams").select("*").in("id", teamIdsFromInvites);

  if (teamsErrorFromInvites) {
    console.error("Error fetching teams:", teamsErrorFromInvites);
    return;
  }

  if (!teamsDataFromInvites) {
    redirect("/signin");
  }

  const filteredTeamsDataFromInvites = teamsDataFromInvites.filter(
    (teamFromInvite) => !teamIds.includes(teamFromInvite.id)
  );

  return (
    <div className="h-screen">
      <Start
        teams={teamsData}
        invites={invitesData}
        teamsFromInvites={filteredTeamsDataFromInvites}
      />
    </div>
  );
}
