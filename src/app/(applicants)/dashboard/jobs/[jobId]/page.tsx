import Tiptap from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { db } from "@/config/db";
import { jobApplications, resumes } from "@/drizzle/schema";
import { ApplyJobModal } from "@/features/applicants/components/apply-job-modal";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { getJobById } from "@/features/employers/jobs/server/jobs.queries";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Badge, Bookmark, Clock, Globe, MapPin, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";


const JobDetailPage = async ({ params }: EditJobPageProps) => {
    const resolvedParams = await params;
    const jobId = parseInt(resolvedParams.jobId);

    if (isNaN(jobId)) return notFound();

    const jobdetails = await getJobById(jobId);

    if (!jobdetails) return notFound();

    const user = await getCurrentUser();
    let hasApplied = false;
    let userResumes: { id: number; fileName: string }[] = [];

    if (user) {
        const existingApplication = await db
            .select()
            .from(jobApplications)
            .where(
                and(
                    eq(jobApplications.jobId, jobId),
                    eq(jobApplications.applicantId, user.id),
                ),
            )
            .limit(1);

        hasApplied = existingApplication.length > 0;

        userResumes = await db
            .select({ id: resumes.id, fileName: resumes.fileName })
            .from(resumes)
            .where(eq(resumes.applicantId, user.id));
    }

    const tagList = jobdetails.tags ? jobdetails.tags.split(",").map(t => t.trim()).filter(t => t !== "") : [];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Unique Floating Header Navigation */}
            <nav className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <Link href="/dashboard/jobs" className="group flex items-center text-sm font-bold text-slate-600 hover:text-blue-600">
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-blue-50">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        Back to Job Board
                    </Link>
                    <ApplyJobModal 
                    jobId = {jobId}
                    jobTitle = {jobdetails.title}
                    hasApplied = {hasApplied}
                    resumes = {userResumes}
                    />
                </div>
            </nav>

            <main className="container mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

                    {/* Left Side: Main Content */}
                    <div className="lg:col-span-8">
                        <header className="mb-10">
                            <div className="mb-6 flex flex-wrap gap-2">
                                <Badge className="bg-blue-100 text-blue-700 border-none px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                    <Zap className="mr-1 h-3 w-3 fill-current" /> {jobdetails.jobType ?? "on-site"}
                                </Badge>
                                <Badge className="border border-slate-200 text-slate-500 bg-white">
                                    {jobdetails.jobLevel ?? "Not Specified"}
                                </Badge>
                            </div>

                            <h1 className="text-2xl font-[700] leading-tight text-slate-900 md:text-4xl lg:text-5xl">
                                {jobdetails.title}
                            </h1>

                            <div className="mt-8 flex flex-wrap items-center gap-6 text-slate-600">
                                <div className="flex items-center font-bold text-slate-900">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 uppercase">
                                        {jobdetails.companyName?.charAt(0) ?? "C"}
                                    </div>
                                    {jobdetails.companyName ?? "Private Limited Company"}
                                </div>
                                <div className="flex items-center text-sm font-medium">
                                    <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                                    {jobdetails.location ?? "Remote / Hybrid"}
                                </div>
                                <div className="flex items-center text-sm font-medium">
                                    <Clock className="mr-2 h-4 w-4 text-blue-500" />
                                    {jobdetails.workType ?? "Full-time"}
                                </div>
                            </div>
                        </header>

                        {/* Impact Stats Grid */}
                        <section className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Compensation</p>
                                <p className="mt-2 text-xl font-bold text-slate-900 leading-none">
                                    {jobdetails.minSalary ? `₹${(jobdetails.minSalary / 100000).toFixed(1)}L` : "Negotiable"}
                                    <span className="mx-1 text-slate-300">-</span>
                                    {jobdetails.maxSalary ? `₹${(jobdetails.maxSalary / 100000).toFixed(1)}L` : "..."}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">Per {jobdetails.salaryPeriod ?? "year"}</p>
                            </div>
                            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Experience</p>
                                <p className="mt-2 text-xl font-bold text-slate-900 leading-none">{jobdetails.experience ?? "Freshers"}</p>
                                <p className="mt-1 text-xs text-slate-500">Required Skills</p>
                            </div>
                            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Education</p>
                                <p className="mt-2 text-xl font-bold text-slate-900 leading-none capitalize">{jobdetails.minEducation ?? "Any"}</p>
                                <p className="mt-1 text-xs text-slate-500">Qualification</p>
                            </div>
                        </section>

                        <div className="space-y-12">
                            {/* Tags Section */}
                            <section>
                                <h3 className="mb-4 text-sm font-black uppercase tracking-tighter text-slate-400">Expertise Required</h3>
                                <div className="flex flex-wrap gap-2">
                                    {tagList.length > 0 ? tagList.map((tag) => (
                                        <span key={tag} className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300">
                                            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                            {tag}
                                        </span>
                                    )) : <span className="text-slate-400">No specific tags provided</span>}
                                </div>
                            </section>

                            {/* Job Description */}
                            <section className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm overflow-hidden">
                                <h3 className="mb-6 text-2xl font-bold text-slate-900">Role Overview</h3>

                                {/* This wrapper ensures long words break and wide content doesn't spill out */}
                                <div className="h-auto w-full overflow-x-auto overflow-wrap-anywhere">
                                    <article
                                        className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-img:rounded-2xl break-words"
                                        dangerouslySetInnerHTML={{ __html: jobdetails.description ?? "No description available." }}
                                    />
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Right Side: Sticky Info Card */}
                    <div className="lg:col-span-4">
                        <aside className="sticky top-24 space-y-6">
                            <div className="overflow-hidden rounded-[2rem] border border-slate-900 bg-white shadow-[10px_10px_0px_0px_#1e293b]">
                                <div className="bg-slate-900 p-6 text-white">
                                    <h3 className="text-lg font-bold">About the Employer</h3>
                                </div>
                                <div className="p-8">
                                    <h4 className="text-2xl font-black text-slate-900">{jobdetails.companyName}</h4>
                                    <div
                                        className="mt-4 text-sm leading-relaxed text-slate-500 line-clamp-6"
                                        dangerouslySetInnerHTML={{ __html: jobdetails.companyBio ?? "Company details not provided." }}
                                    />

                                    <div className="mt-8 space-y-3">
                                        {jobdetails.companyWebsite && (
                                            <Link
                                                href={jobdetails.companyWebsite}
                                                target="_blank"
                                                className="flex w-full items-center justify-center rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200"
                                            >
                                                <Globe className="mr-2 h-4 w-4" /> Company Website
                                            </Link>
                                        )}
                                        <div className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            Posted on {new Date(jobdetails.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Urgency Card */}
                            <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
                                <Sparkles className="mb-4 h-8 w-8 text-blue-200" />
                                <h4 className="text-xl font-bold">Fast-Track Application</h4>
                                <p className="mt-2 text-sm text-blue-100">
                                    This employer typically responds within 48 hours. Apply early to secure an interview slot.
                                </p>
                                <Button className="mt-6 w-full bg-white font-bold text-blue-600 hover:bg-blue-50">
                                    Submit Application
                                </Button>
                            </div>
                        </aside>
                    </div>

                </div>
            </main>
        </div>
    )
}

export default JobDetailPage
