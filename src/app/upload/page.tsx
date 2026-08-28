import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import UploadForm from "@/components/UploadForm";

export default async function UploadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ARTIST") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">Upload a track</h1>
      <p className="text-muted mb-6">
        Share it with the community, or flag it as seeking production help so
        producers can find it.
      </p>
      <UploadForm />
    </div>
  );
}
