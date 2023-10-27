"use client";

import ConfirmSettingsCard from "@/components/app/ConfirmSettingsCard";
import SettingsCard from "@/components/app/SettingsCard";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { Course, Semester, UpdateCourse, Member } from "@/types/types";
import { deleteCourse, leaveCourse, updateCourse } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ROLE_INSTRUCTOR, SEMESTERS } from "@/constants";

export default function GeneralComponent({
  course,
  userMembership,
}: {
  course: Course;
  userMembership: Member;
}) {
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState<UpdateCourse>({
    name: course.name,
    semester: course.semester,
    year: course.year,
    courseCode: course.courseCode,
    coursebookId: course.coursebookId,
    stripeCustomeId: course.stripeCustomerId,
    subscribed: course.subscribed,
  });

  const router = useRouter();
  const { toast } = useToast();

  const role = userMembership.role;

  const isInstructor = role === ROLE_INSTRUCTOR;

  const handleLeaveTeam = async () => {
    setLeaveLoading(true);
    const [_, error] = await leaveCourse(userMembership.userId, course.id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message || "Something went wrong",
      });
    } else {
      toast({
        title: "Success",
        description: "You have left the course",
      });
      router.push("/start");
    }
    setLeaveLoading(false);
  };

  const handleDeleteCourse = async () => {
    setDeleteLoading(true);
    const [_, error] = await deleteCourse(course.id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message || "Something went wrong",
      });
    }
    router.push("/start");
    setDeleteLoading(false);
  };

  const handleUpdate = async () => {
    const [_, error] = await updateCourse(course.id, courseInfo);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message || "Something went wrong",
      });
      return Promise.reject();
    } else {
      toast({
        title: "Success",
        description: "Course updated",
      });
      router.refresh();
      return Promise.resolve();
    }
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
              loading: false,
            }}
          >
            <Input
              value={courseInfo.name}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, name: e.target.value })
              }
              className="max-w-sm"
            />
          </SettingsCard>

          <SettingsCard
            title="Course Semester"
            description="This is the semester this course is offered."
            button={{
              name: "Save",
              onClick: handleUpdate,
              loading: false,
            }}
          >
            <Select
              onValueChange={(value: Semester) =>
                setCourseInfo({ ...courseInfo, semester: value })
              }
              value={courseInfo.semester}
            >
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((r) => {
                  return (
                    <SelectItem value={r} key={r}>
                      {r}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </SettingsCard>

          <SettingsCard
            title="Course Year"
            description="This is the year this course is offered."
            button={{
              name: "Save",
              onClick: handleUpdate,
              loading: false,
            }}
          >
            <Input
              value={courseInfo.year}
              type="number"
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, year: parseInt(e.target.value) })
              }
              className="max-w-sm"
            />
          </SettingsCard>

          <SettingsCard
            title="Course Code"
            description="This is the official course code for this course at your institution."
            button={{
              name: "Save",
              onClick: handleUpdate,
              loading: false,
            }}
          >
            <Input
              value={courseInfo.courseCode}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, courseCode: e.target.value })
              }
              className="max-w-sm"
            />
          </SettingsCard>

          <SettingsCard
            title="Coursebook Id"
            description="This is the course slug. It should be unique and match the name of the folder that contains the coursebook for this course."
            button={{
              name: "Save",
              onClick: () => {
                handleUpdate().then(() => {
                  router.push(`/${courseInfo.coursebookId}/settings/general`);
                });
              },
              loading: false,
            }}
          >
            <Input
              value={courseInfo.coursebookId}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, coursebookId: e.target.value })
              }
              className="max-w-sm"
            />
          </SettingsCard>
        </>
      )}

      {!isInstructor && (
        <ConfirmSettingsCard
          title="Leave course"
          description="Revoke your access to this course. Any resources you have added to this course will remain"
          button={{
            name: "Leave course",
            onClick: handleLeaveTeam,
            loading: leaveLoading,
          }}
          alert={{
            title: "Are you sure?",
            description:
              "If you leave your course, you will have to be invited back in.",
          }}
        />
      )}
      {isInstructor && (
        <ConfirmSettingsCard
          title="Delete course"
          description="Permanently delete your course and all of its contents from the platform. This action is not reversible, so please continue with caution."
          button={{
            name: "Delete course",
            variant: "destructive",
            onClick: handleDeleteCourse,
            loading: deleteLoading,
          }}
          alert={{
            title: "Are you absolutely sure?",
            description: `This action cannot be undone. This will permanently delete your course and remove your data from our servers.`,
          }}
        />
      )}
    </div>
  );
}
