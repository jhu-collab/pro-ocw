"use client";
import IconCircle from "@/components/app/IconCircle";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomeCard = () => {
  const router = useRouter();
  return (
    <div className="flex h-full w-full justify-center md:items-center">
      <div className="flex flex-col items-center space-y-8 p-8 text-center">
        <IconCircle>
          <Home />
        </IconCircle>
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-xl font-medium">
            Welcome! Let&apos;s get started.
          </h1>
          <p className="w-3/4 text-gray-600">
            Explore the app from the sidebar or learn about all of the features
            in the docs.
          </p>
        </div>
        <Link href={"/"} rel="noopener noreferrer">
          <Button>
            <ArrowRight className="mr-2 w-4" /> Go Home
          </Button>
        </Link>
        <Button
          variant="link"
          onClick={() => {
            router.push("/api/auth/signout");
            router.refresh();
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default HomeCard;
