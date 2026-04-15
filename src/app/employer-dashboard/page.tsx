import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { EmployerProfileCompletionStatus } from "@/features/employers/components/employer-profile-status";
import StatsCards from "@/features/employers/components/statscards";


const EmployerDashboard = async () => {

  const user = await getCurrentUser();
  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-semibold text-foreground">
          Hello, <span className="capitalize">{user?.name ? user.name.toLowerCase() : "there"}</span>
        </h1>
        <p className="text-muted-foreground">
          Here is your daily activities and applications
        </p>
      </section>

      {/* // stats  card */}
      <StatsCards />

      {/* // stats  card */}
      <EmployerProfileCompletionStatus />

    </div>


  )
}

export default EmployerDashboard
