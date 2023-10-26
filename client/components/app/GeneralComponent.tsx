"use client";

import ConfirmSettingsCard from "@/components/app/ConfirmSettingsCard";
import SettingsCard from "@/components/app/SettingsCard";
import { Input } from "@/components/ui/input";
import { useSupabase } from "@/providers/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { Course } from "@/types/types";

export default function GeneralComponent({
  course,
  userMembership,
}: {
  course: Course;
  userMembership: Member;
}) {
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [name, setName] = useState(course?.name ?? "");
  const [nameLoading, setNameLoading] = useState(false);
  const router = useRouter();
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const role = userMembership.role;

  const isInstructor = role === "INSTRUCTOR";

  const handleLeaveTeam = async () => {
    setLeaveLoading(true);

    await supabase
      .from("members")
      .delete()
      .eq("user_id", userMembership.user_id)
      .eq("team_id", userMembership.team_id);

    toast({
      title: "Left team",
      description: "You have left the team",
    });
    setLeaveLoading(false);
  };

  const handleDeleteTeam = async () => {
    // setDeleteLoading(true);

    // await supabase.from("teams").delete().eq("id", course.id);

    // toast({
    //   title: "Team deleted",
    //   description: "Your team has been deleted",
    // });

    // router.refresh();

    // setDeleteLoading(false);
  };

  const handleUpdate = async () => {
    // setNameLoading(true);

    // await supabase.from("teams").update({ name }).eq("id", team.id);

    // toast({
    //   title: "Team name updated",
    //   description: "Your team name has been updated",
    // });

    // setNameLoading(false);

    // router.refresh();
  };

  return (
    <div className="flex flex-col space-y-4">
      {isInstructor && (
        <>
          <SettingsCard
            title="Course Name"
            description="This is the display name of your course."
            button={{
              name: "Save",
              onClick: handleUpdate,
              loading: nameLoading,
            }}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-sm"
              placeholder="Team name"
            />
          </SettingsCard>

          <SettingsCard
            title="Course Semester"
            description="This is the semester this course is offered."
            button={{
              name: "Save",
              onClick: handleUpdate,
              loading: nameLoading,
            }}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-sm"
              placeholder="Team name"
            />
          </SettingsCard>

          <SettingsCard
            title="Course Year"
            description="This is the year this course is offered."
            button={{
              name: "Save",
              onClick: handleUpdate,
              loading: nameLoading,
            }}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-sm"
              placeholder="Team name"
            />
          </SettingsCard>

          <SettingsCard
            title="Course Code"
            description="This is the official course code for this course at your institution."
            button={{
              name: "Save",
              onClick: handleUpdate,
              loading: nameLoading,
            }}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-sm"
              placeholder="Team name"
            />
          </SettingsCard>

          <SettingsCard
            title="Coursebook Id"
            description="This is the course slug. It should be unique and match the name of the folder that contains the coursebook for this course."
            button={{
              name: "Save",
              onClick: handleUpdate,
              loading: nameLoading,
            }}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-sm"
              placeholder="Team name"
            />
          </SettingsCard>

          
        </>
      )}
      {/* <SettingsCard
          title="URL Slug"
          description={`This is your team's URL slug. It will be used to access your team's dashboard.`}
          button={{
            name: "Save",
            onClick: async () => {
              try {
                await updateSlugMutation.mutateAsync({
                  teamId: team.id,
                  slug,
                });

                await router.push(`/${slug}/settings/general`);
              } catch (e) {
                if (e instanceof TRPCClientError) {
                  toast.error(e.message);
                }
              }
            },
            loading: updateSlugMutation.isLoading,
          }}
        >
          <div className="flex items-center">
            <p className="flex h-10 items-center rounded-l-md border-y border-l border-gray-300 bg-gray-50 px-3 text-gray-500">
              https://demorepo.com/
            </p>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="max-w-sm rounded-l-none"
            />
          </div>
        </SettingsCard> */}
      {!isInstructor && (
        <ConfirmSettingsCard
          title="Leave team"
          description="Revoke your access to this team. Any resources you have added to this team will remain"
          button={{
            name: "Leave team",
            onClick: handleLeaveTeam,
            loading: leaveLoading,
          }}
          alert={{
            title: "Are you sure?",
            description:
              "If you leave your team, you will have to be invited back in.",
          }}
        />
      )}
      {isInstructor && (
        <ConfirmSettingsCard
          title="Delete team"
          description="Permanently delete your team and all of its contents from the platform. This action is not reversible, so please continue with caution."
          button={{
            name: "Delete team",
            variant: "destructive",
            onClick: handleDeleteTeam,
            loading: deleteLoading,
          }}
          alert={{
            title: "Are you absolutely sure?",
            description: `This action cannot be undone. This will permanently delete your team and remove your data from our servers.`,
          }}
        />
      )}
    </div>
  );
}
