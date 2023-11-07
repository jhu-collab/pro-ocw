"use client";

import Logo from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { signup } from "@/lib/api";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { toast } = useToast();

  const handleSignInWithEmail = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Email is required",
        });
        return;
      }

      if (!password) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Password is required",
        });
        return;
      }

      if (!confirmPassword) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please confirm your password",
        });
        return;
      }

      if (!fullName) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Full name is required",
        });
        return;
      }

      if (password !== confirmPassword) {
        console.log(password, confirmPassword);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Passwords do not match",
        });
        return;
      }

      setIsLoading(true);

      const [data, dataError] = await signup(email, password, fullName);
      if (!dataError) {
        router.push("/signin");
      } else {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            dataError.response.data.message || "Something went wrong",
        });
      }
    },
    [email, password, fullName, toast, router]
  );

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.toLowerCase());
  };

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const updateConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const updateFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center space-y-4 px-4">
        <Logo className="" variant="logo" />
        <h1 className="text-3xl font-semibold">Sign up</h1>
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

          <div className="flex flex-col">
            <label className="mb-2 font-medium" htmlFor="password">
              Confirm Password
            </label>
            <Input
              className=""
              type="password"
              name="password"
              placeholder="Enter your password"
              value={confirmPassword}
              onChange={updateConfirmPassword}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium" htmlFor="fullName">
              Full Name
            </label>
            <Input
              className=""
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={updateFullName}
            />
          </div>

          <Button className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign up
          </Button>

          <div className="flex flex-col text-center">
            <label className="mb-2 font-light" htmlFor="signin">
              Already have an account? <Link href={"/signin"}> Sign in </Link>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
