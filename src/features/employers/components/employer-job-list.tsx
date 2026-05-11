"use client";

import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { deleteJobAction, getEmployerJobsAction } from "../server/jobs.action";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";


export const EmployerJobLists = () => {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        async function fetchJobs() {
            setLoading(true);
            try {
                const jobLists = await getEmployerJobsAction();
                if (jobLists.status === "SUCCESS" && jobLists.data) {
                    setJobs(jobLists.data);
                } else {
                    toast.error(jobLists.message || "Failed to load jobs");
                }
            } catch (error) {
                toast.error("Failed to get Jobs");
                console.error("Failed to fetch Jobs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [jobs.length]);

    const handleEdit = async (jobId: number) => {
        router.push(`/employer-dashboard/jobslist/${jobId}/edit`);
    };

    const handleDelete = async (jobId: number) => {
        if (!jobId) return;

        try {
            const deleteJob = await deleteJobAction(jobId);
            if (deleteJob.status === "SUCCESS") {
                setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
                toast.success(deleteJob.message);
            } else {
                toast.error(deleteJob.message);
            }
        } catch (error) {
            toast.error("something went wrong");
            console.error("Failed to delete job", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs?.map((job) => {
                const tags = job.tags
                    ? job.tags.split(",").map(tag => tag.trim())
                    : [];

                return (
                    <section
                        key={job.id}
                        className={`border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${job.isFeatured ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-white border-gray-200'
                            }`}
                    >
                        <div className="">
                            <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">{job.title}</h2>

                            <div className="flex gap-1">
                                {/* Edit Button */}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-gray-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(job.id);
                                    }}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>

                                {/* Delete with AlertDialog */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive hover:text-destructive"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Job Posting?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the job listing for <span className="font-semibold">"{job.title}"</span>.
                                                <br />
                                                <span className="text-sm text-muted-foreground">
                                                    Posted {new Date(job.createdAt).toLocaleDateString('en-IN')}
                                                </span>
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                onClick={() => handleDelete(job.id)}
                                            >
                                                Delete Job
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>


                        {/* Tags preview (first 3) */}
                        <div className="flex flex-wrap gap-1 mb-4">
                            {tags?.slice(0, 3).map((tag: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{tags.length - 3} more
                                </Badge>
                            )}
                        </div>

                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant="outline">{job.jobType}</Badge>
                            <Badge variant="outline">{job.workType}</Badge>
                            <Badge variant="outline">{job.jobLevel}</Badge>
                        </div>

                        {/* Salary & Location */}
                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                            <div className="font-semibold text-gray-900">
                                ₹{job.minSalary ?? 0 / 100000}L - ₹{job.maxSalary ?? 0 / 100000}L {job.salaryPeriod?.toLowerCase()}
                            </div>
                            <div>{job.location}</div>
                        </div>

                        {/* Posted date */}
                        <div className="text-xs text-gray-500">
                            Posted {new Date(job.createdAt).toLocaleDateString('en-IN')}
                        </div>

                    </section>
                );
            })}
        </div >
    )
};