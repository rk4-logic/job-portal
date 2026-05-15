import ApplicantSidebar from "@/features/applicants/components/applicant-sidebar";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) return redirect("/login");

  if (user.role !== "applicant") return redirect("/employer-dashboard");

  return (
    <div className="grid md:grid-cols-[260px_1fr] min-h-screen bg-background">
      <ApplicantSidebar />
      <main className="p-2 w-full max-w-7xl mx-auto">{children}</main>
    </div>
  );
}