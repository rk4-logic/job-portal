import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";
import { getApplicantProfileData } from "../server/applicant.queries";

export async function ApplicantProfileStatus() {
    const user = await getCurrentUser();
    if (!user) return redirect("/login");

    const profileData = await getApplicantProfileData(user.id);

    // Check what's actually missing to show a dynamic hint
    const missingItems = [];
    if (!profileData?.location) missingItems.push("Location");
    if (!profileData?.biography) missingItems.push("Bio");
    if (!profileData?.experience) missingItems.push("Experience");
    if (!profileData?.resumeUrl) missingItems.push("Resume");

    const isCompleted = missingItems.length === 0;

    if (isCompleted) {
        return null;
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-slate-900 to-black p-6 text-white shadow-xl dark:border-neutral-800">
            {/* Sleek background glow effect */}
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/20 blur-2xl" />
            <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                    {/* Replaced generic user icon with an action-oriented Sparkles badge */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
                        <Sparkles className="h-5 w-5 text-white animate-pulse" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold tracking-tight text-neutral-100">
                                Level up your job search
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                                Incomplete
                            </span>
                        </div>
                        {/* <p className="text-neutral-400 text-sm mt-1 max-w-xl leading-relaxed">
              Finish your setup to unlock custom AI job recommendations. Missing:{" "}
              <span className="text-neutral-200 font-medium">{missingItems.join(", ")}</span>.
            </p> */}
                        <p className="text-slate-300 dark:text-neutral-400 text-sm mt-1 max-w-xl leading-relaxed">
                            Finish setting up your account to get better job recommendations. Missing:{" "}
                            <span className="text-slate-400 dark:text-neutral-200 font-medium">{missingItems.join(", ")}</span>.
                        </p>
                    </div>
                </div>

                <Link href="/dashboard/settings" className="w-full md:w-auto">
                    <Button
                        variant="ghost"
                        className="group relative w-full md:w-auto overflow-hidden whitespace-nowrap bg-white px-5 py-5 text-sm font-semibold text-black transition-all hover:bg-neutral-100 hover:shadow-lg hover:shadow-white/5 active:scale-95"
                    >
                        Complete Profile
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}