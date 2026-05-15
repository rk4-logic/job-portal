import { JobFilters } from "@/features/applicants/jobs/components/job-filters";
import { JobCard } from "@/features/employers/jobs/components/jobCard";
import { getAllJobs } from "@/features/employers/jobs/server/jobs.queries";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BriefcaseBusiness, SearchX } from "lucide-react";

export default async function JobsPage({searchParams} : JobPageProps) {
  const resolvedParams = await searchParams;

  const currentPage = Number(resolvedParams.page) || 1;
  const ITEMS_PER_PAGE = 9;

  const filters: JobFilterParams = {
    search: typeof resolvedParams.search === "string" ? resolvedParams.search : undefined,
    jobType: typeof resolvedParams.jobType === "string" ? resolvedParams.jobType : undefined,
    jobLevel: typeof resolvedParams.jobLevel === "string" ? resolvedParams.jobLevel : undefined,
    workType: typeof resolvedParams.workType === "string" ? resolvedParams.workType : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  const { jobs, totalCount } = await getAllJobs(filters);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Sliding window logic
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);
  if (currentPage === 1) endPage = Math.min(totalPages, 3);
  else if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);

  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    Object.entries(resolvedParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, String(value));
    });
    params.set("page", pageNum.toString());
    return `/jobs?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header Section with Glassmorphism feel */}
        <header className="mb-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
            <BriefcaseBusiness className="w-3 h-3" />
            Explore Careers
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Find your <span className="text-blue-600">dream job</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Discover your next career move with personalized job listings from the world's most innovative companies.
          </p>
        </header>

        {/* Sticky Filter Bar */}
        <div className="sticky top-4 z-30 mb-8 rounded-2xl border border-slate-200/60 bg-white/80 p-4 backdrop-blur-md shadow-sm">
          <JobFilters />
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{jobs.length}</span> of <span className="font-medium text-slate-900">{totalCount}</span> opportunities
          </p>
        </div>

        {/* Main Content */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="transition-all duration-300 hover:-translate-y-1">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
            <div className="rounded-full bg-white p-4 shadow-sm">
              <SearchX className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900">No jobs match your criteria</h3>
            <p className="mt-2 max-w-xs text-slate-500">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <Pagination className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
                    className={`rounded-lg transition-colors ${currentPage === 1 ? "pointer-events-none opacity-40" : "hover:bg-slate-100"
                      }`}
                  />
                </PaginationItem>

                {visiblePages.map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={createPageUrl(pageNum)}
                      isActive={currentPage === pageNum}
                      className={`rounded-lg w-10 h-10 transition-all ${currentPage === pageNum
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                          : "hover:bg-slate-100"
                        }`}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
                    className={`rounded-lg transition-colors ${currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:bg-slate-100"
                      }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}