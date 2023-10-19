import { Box, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "../../providers/supabase-provider";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

type CreateTeamModalProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function CreateTeamModal({
  children,
  open: _open,
  onOpenChange,
}: CreateTeamModalProps) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(_open);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateTeam = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session || !session.user) return;

    const user = session.user;

    if (!name) {
      toast({
        variant: "destructive",
        title: "Team name required.",
        description: "Please enter a team name.",
      });
      return;
    }

    setLoading(true);

    const { data: teams, error } = await supabase
      .from("teams")
      .insert({ name })
      .select();

    if (error || !teams) {
      console.error("Error creating team:", error);
      return;
    }

    const team = teams[0]; // Newly created team instance

    if (!team) {
      console.error("No team data received");
      return;
    }

    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .insert({
        user_id: user.id,
        team_id: team.id,
        role: "ADMIN",
      })
      .select();

    if (memberError || !memberData) {
      console.error("Error adding member:", memberError);
      return;
    }

    router.push(`/${team.id}`);

    toast({
      title: "Team created.",
      description: `You have successfully created the team ${team.name}.`,
    });
    setName("");
    setLoading(false);
  }, [name, router, supabase, toast]);

  const handleOpenChange = useCallback(
    (val: boolean) => {
      setOpen(val);
      onOpenChange?.(val);
    },
    [onOpenChange]
  );

  // this component can either manage itself or allow itself to be managed
  useEffect(() => {
    if (_open != null) {
      setOpen(_open);
    }
  }, [_open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="">
        <DialogHeader>
          <Box className="h-12 w-12 rounded-lg border p-3 shadow-sm" />
          <DialogTitle className="text-lg font-medium">Create team</DialogTitle>
          <DialogDescription className="">
            Collaborate with others and manage your tasks together.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleCreateTeam();
            handleOpenChange(false);
          }}
          className="flex flex-col gap-y-5"
        >
          <label className="w-full">
            <p className="mb-2 font-medium">Team name</p>
            <Input
              className="w-full"
              placeholder="My Team Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </label>
          <DialogFooter>
            <Button className="" disabled={loading} type="submit">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating" : "Create team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
