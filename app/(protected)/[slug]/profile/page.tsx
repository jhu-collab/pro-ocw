import ProfileComponent from "@/components/app/ProfileComponent";
import SettingsShell from "@/components/app/SettingsShell";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Profile({
  params,
}: {
  params: { slug: string };
}) {
  const { slug: teamIdString } = params;

  // convert teamId to number
  const teamId = parseInt(teamIdString, 10);

  // setup supabase
  const supabase = createServerComponentClient<Database>({ cookies });

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

  const team = teamsData.find((team) => team.id === teamId);

  if (!team || !profile) return null;

  return (
    <SettingsShell
      profile={profile}
      allTeams={teamsData}
      team={team}
      title="Profile"
      description="Manage your personal info"
    >
      <ProfileComponent profile={profile} />
    </SettingsShell>
  );
}
