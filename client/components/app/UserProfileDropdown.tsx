import cn from "@/lib/cn";
import { Book, ChevronUp, LogOut, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSupabase } from "@/providers/supabase-provider";

function MenuItem({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-x-2 px-4 py-2",
        className
      )}
    >
      {children}
    </DropdownMenuItem>
  );
}

export default function UserProfileButton({
  user,
  team,
}: {
  user: Profile;
  team: Team;
}) {
  const router = useRouter();
  const { supabase } = useSupabase();
  // const { team } = useTeam();

  const handleSignOut = useCallback(() => {
    supabase.auth.signOut();
  }, [supabase]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full select-none items-center justify-between">
          <div className="flex items-center space-x-2 text-left">
            <Avatar className="rounded-full">
              <AvatarFallback>
                {user.full_name?.[0] ?? user.email?.[0] ?? ""}
              </AvatarFallback>
              <AvatarImage src={undefined} />
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium">{user.full_name}</p>
              <p>{user.email}</p>
            </div>
          </div>
          <ChevronUp className="w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="ml-12 mb-4 animate-slideDownAndFadeIn rounded-md bg-white shadow-lg transition"
        align="start"
        sideOffset={4}
      >
        <MenuItem onClick={() => router.push(`/${team.id}/profile`)}>
          <UserIcon className="w-4" />
          Profile
        </MenuItem>
        <MenuItem onClick={() => router.push("/docs")}>
          <Book className="w-4" />
          Documentation
        </MenuItem>
        <MenuItem onClick={handleSignOut} className="text-gray-500">
          <LogOut className="w-4" />
          Sign out
        </MenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
