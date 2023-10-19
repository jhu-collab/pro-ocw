import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return redirect(`/start`);

  return <div className="h-screen">{children}</div>;
}
