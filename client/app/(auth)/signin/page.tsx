"use client";

import Logo from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSignInWithEmail = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!email) {
        return;
      }

      setIsLoading(true);

      try {
        const { data } = await axios.post("/api/auth/signin", {
          email,
          password,
        });
        if (data) {
          router.push("/start");
        }
      } catch (error) {
        setIsLoading(false);

        toast({
          title: "Error",
          description: "Invalid email or password",
        });
      }
    },
    [email, password, toast, router]
  );

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.toLowerCase());
  };

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center space-y-4 px-4">
        <Logo className="" variant="logo" />
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="text-lg text-gray-500">Welcome to Open Coursebook</p>
        <form
          className="flex w-full flex-col space-y-4"
          onSubmit={handleSignInWithEmail}
        >
          <div className="flex flex-col">
            <label className="mb-2 font-medium" htmlFor="email">
              Email
            </label>
            <Input
              className=""
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={updateEmail}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium" htmlFor="password">
              Password
            </label>
            <Input
              className=""
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={updatePassword}
            />
          </div>

          <Button className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
