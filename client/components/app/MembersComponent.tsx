"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MoreHorizontal, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { Course, User, Invite, Member, Role } from "@/types/types";
import {
  batchCreateInvite,
  deleteInviteById,
  deleteMember,
  updateMember,
} from "@/lib/api";
import { ROLES, ROLE_INSTRUCTOR, ROLE_STUDENT, ROLE_TA } from "@/constants";

const InviteSection = ({ course, user }: { course: Course; user: User }) => {
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState<{ email: string; role: Role }[]>([
    { email: "", role: ROLE_STUDENT },
  ]);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddInvite = useCallback(() => {
    setInvites((invites) => [...invites, { email: "", role: ROLE_STUDENT }]);
  }, []);

  const handleChangeEmail = useCallback((i: number, value: string) => {
    setInvites((invites) => {
      const newInvites = [...invites];
      const row = newInvites[i];
      if (row) {
        row.email = value;
      }
      return newInvites;
    });
  }, []);

  const handleChangeRole = useCallback((i: number, value: Role) => {
    setInvites((invites) => {
      const newInvites = [...invites];
      const row = newInvites[i];
      if (row) {
        row.role = value;
      }
      return newInvites;
    });
  }, []);

  const handleSendInvites = useCallback(async () => {
    if (!course) return;

    const invitesToCreate = invites.filter((invite) => invite.email);

    if (!invitesToCreate.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please enter at least one email",
      });
      return;
    }

    setLoading(true);

    const [_, error] = await batchCreateInvite({
      data: invitesToCreate.map((invite) => ({
        email: invite.email,
        role: invite.role,
        courseId: course.id,
        userId: user.id,
      })),
    });
    setLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response.data.message || error.message,
      });
      return;
    }
    toast({
      title: "Invites sent!",
      description: "Your invites have been sent.",
    });

    setInvites([{ email: "", role: ROLE_STUDENT }]);

    router.refresh();
  }, [course, invites, router, toast, user]);

  return (
    <div className="rounded-lg border bg-white">
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium">Invite</h3>
      </div>
      <div className="mt-1 flex flex-col gap-y-2 px-6">
        {invites.map(({ email, role }, i) => {
          return (
            <div key={i} className="grid grid-cols-3 gap-x-3">
              <div className="col-span-2">
                <Input
                  value={email}
                  id={`invite-email-${i}`}
                  type="text"
                  // autoComplete="new" prevents the browser from autofilling the field with the same email
                  autoComplete="new"
                  placeholder="Email"
                  className="w-full"
                  onChange={(e) => handleChangeEmail(i, e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <Select
                  onValueChange={(v) => handleChangeRole(i, v as Role)}
                  defaultValue={role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => {
                      const formattedRole =
                        role.charAt(0).toUpperCase() +
                        role.slice(1).toLowerCase();
                      return (
                        <SelectItem key={role} value={role}>
                          {formattedRole}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        })}
      </div>
      <div className="my-5 flex items-center justify-between px-6">
        <Button
          variant="link"
          className="flex items-center gap-x-2 text-gray-500"
          onClick={handleAddInvite}
        >
          <Plus className="w-4" /> Add another
        </Button>
      </div>
      <div className="flex w-full justify-end rounded-b-lg border-t bg-gray-50 px-6 py-3">
        <Button disabled={loading} onClick={handleSendInvites}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Sending invites" : "Send invites"}
        </Button>
      </div>
    </div>
  );
};

const InviteLinkTab = ({ title, link }: { title: string; link: string }) => {
  return (
    <div className="flex justify-between border-b border-gray-100 py-3 px-4 last-of-type:border-none">
      <div className="flex items-center gap-x-2">
        <div className="flex flex-col">
          <p className="font-medium py-3"> {title } Invite Link</p>
          <p className="text-gray-500">{link}</p>
        </div>
      </div>
    </div>
  );
};

const InviteLinkSection = ({ course }: { course: Course }) => {
  const links = course.inviteLinks;
  if (!links) return null;
  const currentDomain = window.location.origin + "/invite-link/";
  const studentLink = links.find((l) => l.role === ROLE_STUDENT);
  const taLink = links.find((l) => l.role === ROLE_TA);
  return (
    <div className="rounded-lg border bg-white">
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium">Invite Links</h3>
      </div>
      <Tabs defaultValue="students" className="pb-2">
        <TabsList className="ml-4 mt-3 mb-1">
          <TabsTrigger value="students">Student</TabsTrigger>
          <TabsTrigger value="ta">Teaching Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <InviteLinkTab
            title={"Student"}
            link={currentDomain + studentLink?.id}
          />
        </TabsContent>
        <TabsContent value="ta">
          <InviteLinkTab
            link={currentDomain + taLink?.id}
            title={"Teaching Assistant"}
          />
        </TabsContent>
      </Tabs>
      <div className="mt-1 flex flex-col gap-y-2 px-6"></div>
    </div>
  );
};

const InvitedSection = ({
  course,
  courseInvites,
}: {
  course: Course;
  courseInvites: Invite[];
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleDeleteInvite = useCallback(
    async (invite: Invite) => {
      if (!confirm("Are you sure you want to delete this invite?")) return;

      const [_, error] = await deleteInviteById(invite.id);
      if (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.response.data.message || error.message,
        });

        return;
      }

      toast({
        title: `Invite to ${invite.email} deleted`,
      });

      router.refresh();
    },
    [router, toast]
  );

  if (!course || !courseInvites) {
    router.push("/start");
  }

  return (
    <div className="flex w-full flex-col">
      {courseInvites?.length === 0 && (
        <p className="py-4 text-center text-gray-500">No pending invites</p>
      )}
      {courseInvites?.map((i) => {
        const role = i.role;

        const formattedRole =
          role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

        return (
          <div
            className="flex justify-between border-b py-3 px-6 last-of-type:border-none"
            key={i.id}
          >
            <div className="flex items-center gap-x-2">
              <div className="flex flex-col gap-y-1">
                <p className="">{i.email}</p>
                <p className="font-medium text-gray-500">{formattedRole}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal className="h-8 w-8 px-2 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuItem
                  onClick={async () => {
                    await resendInviteEmailMutation.mutateAsync({
                      teamId: team.id,
                      inviteId: i.id,
                    });
                    toast.success(`Invite resent to ${i.email}`);
                  }}
                >
                  Resend invite
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      getTeamInviteUrl({ code: i.code, email: i.email })
                    );
                  }}
                >
                  Copy invite link
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={async () => {
                    await handleDeleteInvite(i);
                  }}
                >
                  Delete invite
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
};

const MembersSection = ({
  course,
  user,
  userMember,
  courseMembers,
}: {
  course: Course;
  user: User;
  userMember: Member;
  courseMembers: Member[];
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleUpdateRole = useCallback(
    async (member: Member, role: Role) => {
      if (!course) return;

      if (member.userId === user.id) {
        toast({
          variant: "destructive",
          title: "You can't change your own role",
          description: "Ask another admin to change your role",
        });
        return;
      }

      const [_, error] = await updateMember(member.userId, {
        ...member,
        role,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.response.data.message || error.message,
        });
        return;
      }

      toast({
        title: "Role updated",
        description: `Role has been updated to ${role}`,
      });
    },
    [course, user, toast]
  );

  const handleRemoveMember = useCallback(
    async (member: Member) => {
      if (!course) return;

      if (member.userId === user?.id) {
        toast({
          variant: "destructive",
          title: "You can't remove yourself",
          description: "Leave the team instead",
        });
        return;
      }

      if (!confirm("Are you sure you want to remove this member?")) return;

      const [_, error] = await deleteMember(member.userId, member.courseId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.response.data.message || error.message,
        });
        return;
      }

      toast({
        title: "Member removed",
        description: `Removed from the team`,
      });
      router.refresh();
    },
    [course, user, toast, router]
  );

  if (!user || !course || !courseMembers) {
    router.push("/start");
  }

  const isInstructor = userMember.role === ROLE_INSTRUCTOR;
  const isTA = userMember.role === ROLE_TA;

  const canDeleteMember = (member: Member) => {
    if (member.userId === user.id) return false;
    if (isInstructor) return true;
    if (isTA) {
      return member.role !== ROLE_INSTRUCTOR;
    }
    return false;
  };

  const canUpdateMember = (member: Member) => {
    if (member.userId === user.id) return false;
    if (isInstructor) return true;
    if (isTA) {
      return member.role === ROLE_STUDENT;
    }
    return false;
  };
  return (
    <>
      {courseMembers.map((m) => {
        const role = m.role;
        const profile = m.user;
        return (
          <div
            className="flex justify-between border-b border-gray-100 py-3 px-4 last-of-type:border-none"
            key={m.id}
          >
            <div className="flex items-center gap-x-2">
              <Avatar>
                <AvatarFallback>
                  {(profile?.fullName ?? profile?.email ?? "")[0]}
                </AvatarFallback>
                <AvatarImage src={undefined} />
              </Avatar>
              <div className="flex flex-col">
                <p className="font-medium">
                  {profile?.fullName ?? profile?.email ?? "Unknown"}
                </p>
                <p className="text-gray-500">{profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-x-6">
              <div className="">
                {!canUpdateMember(m) ? (
                  <span className="text-gray-500">
                    {role[0].toUpperCase() + role.slice(1).toLowerCase()}
                  </span>
                ) : (
                  <Select
                    onValueChange={(v) => handleUpdateRole(m, v as Role)}
                    defaultValue={role}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => {
                        return (
                          <SelectItem value={r} key={r}>
                            {r[0].toUpperCase() + r.slice(1).toLowerCase()}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {canDeleteMember(m) && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreHorizontal className="w-4 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={async () => {
                        await handleRemoveMember(m);
                      }}
                      className="text-red-500"
                    >
                      Remove user
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default function MembersComponent({
  course,
  user,
  courseMembers,
  courseInvites,
  userMember,
}: {
  course: Course;
  user: User;
  userMember: Member;
  courseMembers: Member[];
  courseInvites: Invite[];
}) {
  const isAdmin =
    userMember.role === ROLE_INSTRUCTOR || userMember.role === ROLE_TA;
  return (
    <div className="flex flex-col gap-y-8">
      {isAdmin && <InviteSection course={course} user={user} />}
      {isAdmin && <InviteLinkSection course={course} />}
      <div className="flex flex-col rounded-lg border bg-white">
        <h3 className="ml-6 mt-4 text-lg font-medium">Members</h3>
        <Tabs defaultValue="members" className="pb-2">
          {isAdmin && (
            <TabsList className="ml-4 mt-3 mb-1">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="invited">Invited</TabsTrigger>
            </TabsList>
          )}
          <TabsContent value="members">
            <MembersSection
              course={course}
              user={user}
              userMember={userMember}
              courseMembers={courseMembers}
            />
          </TabsContent>
          <TabsContent value="invited">
            <InvitedSection course={course} courseInvites={courseInvites} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
