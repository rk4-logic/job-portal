import ApplicantSettingsForm from "@/features/applicants/components/settings-form";
import { getApplicantProfileData } from "@/features/applicants/server/applicant.queries";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) return redirect("/login");

  const initialData = await getApplicantProfileData(user.id);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your personal information and professional profile.
        </p>
      </div>

      <ApplicantSettingsForm initialData={initialData} />
    </div>
  );
}