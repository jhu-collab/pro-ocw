"use client";
import SettingsCard from "@/components/app/SettingsCard";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { User } from "@/types/types";
import { updateUser } from "@/lib/api";

const ProfileComponent = ({ user }: { user: User }) => {
  const [name, setName] = useState(user.fullName ?? "");

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleUpdateName = async () => {
    setLoading(true);
    const [data, error] = await updateUser(user.id, {
      fullName: name,
      metadata: JSON.stringify(user.metadata),
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.response.data.message,
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated",
      });
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <SettingsCard
      title="Full name"
      description="Your full name will be displayed on your profile and in your team."
      button={{
        name: "Save",
        onClick: () => handleUpdateName(),
        loading,
      }}
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="max-w-sm"
        placeholder="Your name"
      />
    </SettingsCard>
  );
};

export default ProfileComponent;
