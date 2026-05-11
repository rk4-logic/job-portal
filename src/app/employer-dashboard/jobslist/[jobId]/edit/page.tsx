import { JobForm } from "@/features/employers/components/employer-job-form";
import { getJobByIdAction } from "@/features/employers/server/jobs.action";
import { redirect } from "next/navigation";

const EditJobPage = async ({ params }: EditJobPageProps) => {

    const resolvedParams = await params;
    const jobId = Number(resolvedParams.jobId);

    if (!jobId || isNaN(jobId)) redirect("/employer-dashboard/jobs");

    const { status, data: job } = await getJobByIdAction(jobId);

    if (status === "ERROR" || !job) redirect("/employer-dashboard/jobs");

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Edit Job: {job.title}</h1>
            </div>

            {/* 3. Pass the fetched data to the form */}
            <JobForm initialData={job} isEditMode={true} />
        </div>
    )

};

export default EditJobPage;