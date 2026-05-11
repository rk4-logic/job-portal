import { getCurrentUser } from "@/features/auth/server/auth.queries"
import { redirect } from "next/navigation";

const ApplicantDashboard = async() => {

  const user = await getCurrentUser();
  
  return (
    <div>
      <h1>Welcome to Dashboard</h1>
    </div>
  )
}

export default ApplicantDashboard
