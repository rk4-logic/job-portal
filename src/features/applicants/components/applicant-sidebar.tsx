"use client";

import { logoutUserAction } from "@/features/auth/server/auth.actions ";
import { cn } from "@/lib/utils";
import { 
  MagnifyingGlassIcon, 
  BriefcaseMetalIcon, 
  UserCircleIcon, 
  BookmarkSimpleIcon, 
  BellRingingIcon, 
  FileTextIcon, 
  GearIcon, 
  SignOutIcon,
  ChartLineUpIcon
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const base = "/dashboard";

const navigationItems = [
  { name: "Find Jobs", icon: MagnifyingGlassIcon, href: base + "/jobs" },
  { name: "My Applications", icon: BriefcaseMetalIcon, href: base + "/applications" },
  { name: "Saved Jobs", icon: BookmarkSimpleIcon, href: base + "/saved" },
  { name: "My Resume", icon: FileTextIcon, href: base + "/resume" },
  { name: "Job Alerts", icon: BellRingingIcon, href: base + "/alerts" },
  { name: "Career Stats", icon: ChartLineUpIcon, href: base + "/stats" },
];

const bottomItems = [
  { name: "Public Profile", icon: UserCircleIcon, href: base + "/profile" },
  { name: "Settings", icon: GearIcon, href: base + "/settings" },
];

const EmployeeSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === base + "/" && pathname === base) return true;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="w-64 flex flex-col bg-white border-r border-slate-100 h-screen sticky top-0">
      {/* Brand Section - Softer Blue for Employees */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <MagnifyingGlassIcon size={22} weight="bold" className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none text-slate-900">Job Portal<span className="text-indigo-600">{" "}Pro</span></span>
            <span className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">Candidate Portal</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
        {navigationItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 text-[14px] font-medium rounded-xl transition-all duration-200",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon 
                size={22} 
                weight={active ? "fill" : "regular"} 
                className={cn(
                  "transition-colors",
                  active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {item.name}
              {item.name === "Job Alerts" && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-rose-500" />
              )}
            </Link>
          );
        })}

        <div className="pt-6">
          <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
          {bottomItems.map((item) => {
             const active = isActive(item.href);
             const Icon = item.icon;
             return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 text-[14px] font-medium rounded-xl transition-all duration-200",
                  active ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={22} weight={active ? "fill" : "regular"} />
                {item.name}
              </Link>
             )
          })}
        </div>
      </nav>

      {/* Profile Card / Sign Out */}
      <div className="p-4 border-t border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-3 mb-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
             {/* Replace with actual user image */}
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-slate-900 truncate">Alex Rivera</span>
            <span className="text-[11px] text-slate-500 truncate">Pro Member</span>
          </div>
        </div>
        
        <button
          onClick={() => logoutUserAction()}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
        >
          <SignOutIcon size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;