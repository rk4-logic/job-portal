import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Building2, Calendar, DollarSign, Briefcase } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { getAppliedJobsForApplicant } from "../server/applicant.queries";
import { redirect } from "next/navigation";

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase() || "applied";

  const styles: Record<string, string> = {
    applied: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/50",
    interviewing: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/50",
    offered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/50",
    rejected: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/50",
  };

  const currentStyle = styles[normalized] || styles.applied;

  return (
    <Badge variant="outline" className={`rounded-md font-medium px-2.5 py-0.5 text-xs capitalize transition-colors ${currentStyle}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current inline-block" />
      {status || "Applied"}
    </Badge>
  );
}

export async function RecentApplications() {
  const user = await getCurrentUser();
  if (!user) return redirect("/login");

  const allApplications = await getAppliedJobsForApplicant(user.id);
  const recentApplications = allApplications.slice(0, 5);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-900">
        <div>
          <h3 className="font-semibold text-slate-900 tracking-tight dark:text-neutral-100">
            Recently Applied
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            Your latest job applications updates
          </p>
        </div>
        <Link
          href="/dashboard/applied-jobs"
          className="group text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
        >
          View all 
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {recentApplications.length === 0 ? (
        // Beautifully spaced empty state fallback 
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-neutral-200">No applications yet</p>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            Jobs you apply to will appear here. Start your journey by exploring open listings.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 border-b border-slate-100 hover:bg-slate-50/70 dark:bg-slate-900/40 dark:border-slate-900">
                <TableHead className="w-[45%] pl-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Job</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date Applied</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
                <TableHead className="text-right pr-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplications.map((app) => {
                const { application, job, employer } = app;

                return (
                  <TableRow 
                    key={application.id} 
                    className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors duration-150 dark:border-slate-900 dark:hover:bg-slate-900/20"
                  >
                    {/* Job Details Column */}
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 overflow-hidden border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800">
                          {employer?.bannerImageUrl ? (
                            <Image
                              src={employer.bannerImageUrl}
                              alt={employer.name || "Company"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Building2 className="h-4 w-4 text-slate-400" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-900 line-clamp-1 text-sm dark:text-neutral-100">
                              {job.title}
                            </span>
                            <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px] font-medium tracking-wide bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {job.jobType}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-neutral-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {job.location || "Remote"}
                            </span>
                            {(job.minSalary || job.maxSalary) && (
                              <span className="flex items-center gap-0.5">
                                <DollarSign className="h-3 w-3 text-slate-400" />
                                {job.salaryCurrency} {job.minSalary?.toLocaleString() ?? "0"} - {job.maxSalary?.toLocaleString() ?? "0"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Date Column */}
                    <TableCell className="text-sm text-slate-600 dark:text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {format(new Date(application.appliedAt), "MMM d, yyyy")}
                      </div>
                    </TableCell>

                    {/* Status Column using dynamically calculated helper component */}
                    <TableCell>
                      <StatusBadge status={application?.status} />
                    </TableCell>

                    {/* Action Column */}
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-md text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:text-neutral-300 dark:hover:bg-slate-900 dark:hover:text-blue-400 transition-all active:scale-98"
                        asChild
                      >
                        <Link href={`/dashboard/jobs/${job.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}