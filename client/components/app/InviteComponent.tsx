"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DoorOpenIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Course, User, Invite } from "@/types/types";
import { acceptInvite } from "@/lib/api";
import { useToast } from "../ui/use-toast";

export default function InviteComponent({
  course,
  user,
  invite,
}: {
  course: Course;
  user: User;
  invite: Invite;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  if (!user) {
    router.push("/signin");
  }

  const handleJoin = async () => {
    setLoading(true);
    const [_, error] = await acceptInvite(invite.id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message || "Something went wrong.",
      });
      setLoading(false);
    } else {
      router.push(`/${course.coursebookId}`);
    }
  };

  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col items-center space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Course Invitation</CardTitle>
            <CardDescription className="text-center">
              Join {course.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="justify-center flex">
              <Button className="p-6" onClick={handleJoin}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <DoorOpenIcon size={24} />
                )}

                <span className="ml-2 text-lg">Join</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-center max-w-md">
            By joining, you will be able to access the course&apos;s material.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
