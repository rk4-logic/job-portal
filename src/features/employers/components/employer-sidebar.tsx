"use client";

import { logoutUserAction } from "@/features/auth/server/auth.actions ";
import { cn } from "@/lib/utils";
import { 
  SquaresFourIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  BookmarkSimpleIcon, 
  CreditCardIcon, 
  BuildingsIcon, 
  GearIcon, 
  SignOutIcon, 
  PlusCircleIcon
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const base = "/employer-dashboard";

// Swapped to Phosphor Icons for a fresh look
const navigationItems = [
  { name: "Overview", icon: SquaresFourIcon, href: base + "/" },
  { name: "Applications", icon: UsersIcon, href: base + "/applications" },
  { name: "Post a Job", icon: PlusCircleIcon, href: base + "/jobs/create" },
  { name: "My Jobs", icon: BriefcaseIcon, href: base + "/jobs" },
  { name: "Saved Candidates", icon: BookmarkSimpleIcon, href: base + "/saved" },
  { name: "Plans & Billing", icon: CreditCardIcon, href: base + "/billing" },
  { name: "Companies", icon: BuildingsIcon, href: base + "/companies" },
  { name: "Settings", icon: GearIcon, href: base + "/settings" },
];

const EmployerSidebar = () => {
  const pathname = usePathname();

  // Optimized Active Link Logic
  const isActive = (href: string) => {
    if (href === base + "/" && pathname === base) return true;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="w-64 flex flex-col bg-slate-50/50 border-r border-slate-200 h-screen sticky top-0">
      {/* Branding Section */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <BriefcaseIcon size={20} weight="duotone" className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Job Portal <span className="text-primary">Pro</span>
          </span>
        </div>
        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest ml-12">
          Employer Console
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1.5">
        {navigationItems.map((curNav) => {
          const active = isActive(curNav.href || "");
          const Icon = curNav.icon;

          return (
            <Link
              key={curNav.name}
              href={curNav.href || "#"}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300",
                active
                  ? "bg-white text-primary shadow-sm shadow-slate-200"
                  : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
              )}
            >
              {/* Active Indicator Line */}
              {active && (
                <span className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
              )}
              
              <Icon 
                size={22} 
                weight={active ? "fill" : "duotone"} 
                className={cn(
                  "transition-colors",
                  active ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {curNav.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-900 rounded-2xl p-4 shadow-xl">
          <button
            onClick={() => logoutUserAction()}
            className="flex items-center cursor-pointer justify-center gap-3 py-2.5 text-sm font-bold text-white hover:text-red-400 transition-colors w-full"
          >
            <SignOutIcon size={20} weight="bold" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default EmployerSidebar;