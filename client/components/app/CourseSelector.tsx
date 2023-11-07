import { Check, ChevronDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Course } from "@/types/types";

export default function TeamSelector({
  course,
  allCourses,
}: {
  course: Course;
  allCourses: Course[];
}) {
  const router = useRouter();

  const handleSelectCourse = useCallback(
    async (course: Course) => {
      await router.push(`/${course.coursebookId}`);
    },
    [router]
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex select-none items-center justify-between rounded-lg bg-primary-foreground p-2 shadow-outline transition hover:shadow-md-outline">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>{course?.name[0] ?? ""}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{course?.name ?? "Loading"}</p>
            </div>
            <ChevronDown className="w-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="animate-slideDownAndFadeIn rounded-md bg-background text-primary transition"
          align="start"
          sideOffset={4}
        >
          {allCourses && allCourses.length > 0 && (
            <div className="flex flex-col">
              {allCourses.map((c) => {
                const selected = c.id === course.id;
                return (
                  <DropdownMenuItem
                    key={c.id}
                    className="flex w-full items-center gap-x-2 px-3 py-2"
                    onClick={async () => {
                      await handleSelectCourse(c);
                    }}
                  >
                    <Avatar>
                      <AvatarFallback>{c.name[0]}</AvatarFallback>
                    </Avatar>
                    <p className="">{c.name}</p>
                    {selected && <Check className="w-4" />}
                  </DropdownMenuItem>
                );
              })}
            </div>
          )}
          <DropdownMenuItem
            className="flex gap-x-2 rounded-b px-3 text-gray-600"
            onClick={() => {
              router.push("/create");
            }}
          >
            <Plus className="mx-3 w-4" />
            Create course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
