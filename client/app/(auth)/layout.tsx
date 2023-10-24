import { getUser } from "@/lib/server";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getUser();

  if (user) return redirect(`/start`);

  return <div className="h-screen">{children}</div>;
}
