import CreateWorkspace from "@/components/app/CreateCourse";
import { getUser } from "@/lib/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreatePage() {

  const user = await getUser();
  
  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="h-screen">
      <CreateWorkspace user={user} />
    </div>
  );
}
