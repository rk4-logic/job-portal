import { getCurrentUser } from "@/features/auth/server/auth.queries";
import EmployerSidebar from "@/features/employers/components/employer-sidebar";
import "@radix-ui/themes";
import { Theme } from "@radix-ui/themes";
import { redirect } from "next/navigation";


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  // console.log("Employer Dashboard Layout - Current User:", user);

  if (!user) return redirect("/login");

  if (user.role !== "employer") return redirect("/dashboard");

  return (
    <div className="grid md:grid-cols-[260px_1fr] min-h-screen bg-background">
      <EmployerSidebar />
      <Theme>
        <main className="p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </Theme>
    </div>
  );
};