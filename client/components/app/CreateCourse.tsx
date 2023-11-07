"use client";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import Step, { StepProps } from "./Steps";
import Testimonial from "./Testimonial";
import { CreateCourse, Semester, User } from "@/types/types";
import { createCourse } from "@/lib/api";
import { toast, useToast } from "../ui/use-toast";
import { SEMESTERS } from "@/constants";

export default function CreateCourse({ user }: { user: User }) {
  const router = useRouter();
  const { toast } = useToast();
  const [stepIndex, setStepIndex] = useState(0);
  const [course, setCourse] = useState<CreateCourse>({
    name: "",
    coursebookId: "",
    semester: "FALL",
    year: 0,
    courseCode: "",
  });

  const GET_COURSE_NAME_STEP: StepProps = {
    title: "What do you want to name your course?",
    icon: <Home className="h-6 w-6 text-gray-600" />,
    fieldType: "text",
    placeholder: "ex: Data Structures",
    onSubmit: async (value: string) => {
      if (!value || !user) return;
      setCourse({ ...course, name: value });
      setStepIndex(stepIndex + 1);
    },
  };

  const GET_SEMESTER_STEP: StepProps = {
    title: "What semester is the course?",
    icon: <Home className="h-6 w-6 text-gray-600" />,
    fieldType: "dropdown",
    placeholder: "ex: FALL",
    dropdownItems: SEMESTERS,
    selectDefault: "FALL",
    onSubmit: async (value: Semester) => {
      if (!value || !user) return;
      setCourse({ ...course, semester: value });
      setStepIndex(stepIndex + 1);
    },
  };

  const GET_YEAR_STEP: StepProps = {
    title: "What year is the course?",
    icon: <Home className="h-6 w-6 text-gray-600" />,
    fieldType: "text",
    placeholder: "ex: 2021",
    onSubmit: async (value: string) => {
      if (!value || !user) return;
      setCourse({ ...course, year: parseInt(value) });
      setStepIndex(stepIndex + 1);
    },
  };

  const GET_COURSE_CODE_STEP: StepProps = {
    title: "What is the course code?",
    icon: <Home className="h-6 w-6 text-gray-600" />,
    fieldType: "text",
    placeholder: "ex: EN.601.226",
    onSubmit: async (value: string) => {
      if (!value || !user) return;
      setCourse({ ...course, courseCode: value });
      setStepIndex(stepIndex + 1);
    },
  };

  const GET_COURSEBOOK_ID_STEP: StepProps = {
    title: "What is the coursebook ID?",
    icon: <Home className="h-6 w-6 text-gray-600" />,
    fieldType: "text",
    placeholder: "ex: ds226-sp-23",
    onSubmit: async (value: string) => {
      if (!value || !user) return;
      const [created, courseError] = await createCourse({
        ...course,
        coursebookId: value,
      });
      if (!created || courseError) {
        toast({
          variant: "destructive",
          title: "Error creating course",
          description:
            courseError.response.data.message || "Something went wrong",
        });
        return;
      }
      router.push(`/${created.coursebookId}`);
    },
  };

  const steps = [
    GET_COURSE_NAME_STEP,
    GET_SEMESTER_STEP,
    GET_YEAR_STEP,
    GET_COURSE_CODE_STEP,
    GET_COURSEBOOK_ID_STEP,
  ];

  if (!user) {
    router.push("/signin");
  }
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-auto overflow-y-auto">
        <div className="flex flex-1 flex-col overflow-y-auto px-8 lg:px-16">
          <div className="mt-8">
            <Logo variant="wordmark" />
          </div>
          <div className="my-auto">
            <div className="mb-32">
              <Step {...steps[stepIndex]} />
            </div>
          </div>
        </div>
        <div className="hidden flex-1 items-center justify-center border-l bg-background lg:flex">
          <div className="mx-8">
            <Testimonial />
          </div>
        </div>
      </div>
    </div>
  );
}
