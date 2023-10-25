"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRightIcon, RocketIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import IconCircle from "./IconCircle";
import Logo from "./Logo";
import Testimonial from "./Testimonial";
import { Course, Invite } from "@/types/types";

export default function Start({
  courses,
  invites,
  coursesFromInvites,
}: {
  courses: Course[];
  invites: Invite[];
  coursesFromInvites: Course[];
}) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-auto overflow-y-auto">
        <div className="flex flex-1 flex-col overflow-y-auto px-8 lg:px-16">
          <div className="mt-8">
            <Logo variant="wordmark" />
          </div>
          <div className="my-auto">
            <div className="w-full max-w-lg mb-4">
              <IconCircle>
                <RocketIcon className="h-6 w-6 text-gray-600" />
              </IconCircle>
            </div>
            <div className="flex flex-col space-y-6">
              <CourseCard />
              {courses.length > 0 && <CourseList courses={courses} />}
              {coursesFromInvites.length > 0 && (
                <InviteList
                  invites={invites}
                  coursesFromInvites={coursesFromInvites}
                />
              )}
            </div>
            <div className="mt-4">
              <Button
                variant={"outline"}
                onClick={async () => {
                  router.push("/api/auth/signout");
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden flex-1 items-center justify-center border-l bg-gray-50 lg:flex">
          <div className="mx-8">
            <Testimonial />
          </div>
        </div>
      </div>
    </div>
  );
}

const CourseCard = () => {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new course</CardTitle>
        <CardDescription>
          Create a new course for your students.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => router.push("/create")}>Create Course</Button>
      </CardContent>
    </Card>
  );
};

const CourseList = ({ courses }: { courses: Course[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Your courses</CardTitle>
      <CardDescription>Launch your course to get started.</CardDescription>
    </CardHeader>
    <CardContent>
      {courses.map((course) => (
        <Link
          href={`/${course.coursebookId}`}
          key={course.coursebookId}
          className="flex justify-between items-center p-3 border-b hover:bg-gray-100 cursor-pointer"
        >
          <span>{course.name}</span>
          <ChevronRightIcon />
        </Link>
      ))}
    </CardContent>
  </Card>
);

const InviteList = ({
  invites,
  coursesFromInvites,
}: {
  invites: Invite[];
  coursesFromInvites: Course[];
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Your Invitations</CardTitle>
      <CardDescription>Check out your invitations</CardDescription>
    </CardHeader>
    <CardContent>
      {coursesFromInvites.map((course) => {
        const invite = invites.find((invite) => invite.courseId === course.id);

        if (!invite) return null;

        return (
          <Link
            href={`/invitation/${invite.id}`}
            key={invite.id}
            className="flex justify-between items-center p-3 border-b hover:bg-gray-100 cursor-pointer"
          >
            <span>{course.name}</span>
            <ChevronRightIcon />
          </Link>
        );
      })}
    </CardContent>
  </Card>
);
