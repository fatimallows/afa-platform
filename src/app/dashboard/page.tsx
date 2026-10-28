import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  IconAlertCircle,
  IconArrowRight,
  IconChevronDown,
  IconChevronRight,
  IconClipboardText,
  IconSearch,
  type TablerIcon,
} from "@tabler/icons-react";
import Header from "@/components/Header";
import StatusBadge, { type AfaStatus } from "@/components/StatusBadge";
import { createClient } from "@/lib/supabase/server";

// Sample data only — no real AFA records are read from a database yet.
const stats = [
  { label: "Total AFAs", value: 128, bg: "bg-[#E8E8E8]", text: "text-muted-text" },
  { label: "Approved", value: 94, bg: "bg-teal-tint", text: "text-status-approved-text" },
  { label: "In Review", value: 27, bg: "bg-status-ofa-bg", text: "text-status-ofa-text" },
  { label: "Returned", value: 7, bg: "bg-status-returned-bg", text: "text-crimson" },
];

const afaTypeBreakdown = [
  { label: "Off-campus", count: 46, bar: "bg-teal", dot: "bg-teal" },
  { label: "On-campus", count: 38, bar: "bg-periwinkle", dot: "bg-periwinkle" },
  { label: "Internship", count: 22, bar: "bg-orange", dot: "bg-orange" },
  { label: "NSTP", count: 14, bar: "bg-deep-yellow", dot: "bg-deep-yellow" },
  { label: "Special", count: 8, bar: "bg-crimson", dot: "bg-crimson" },
];
const totalAfas = afaTypeBreakdown.reduce((sum, item) => sum + item.count, 0);

const filterPills = [
  { label: "All 8", active: true },
  { label: "Needs Action", count: 2 },
  { label: "In Review" },
  { label: "Approved" },
];

type Application = {
  activity: string;
  meta: string;
  warning?: string;
  warningColor?: string;
  warningIcon?: TablerIcon;
  type: string;
  date: string;
  status: AfaStatus;
  action: string;
  secondaryAction?: string;
  highlight?: boolean;
};

const applications: Application[] = [
  {
    activity: "ARTS 1 · Ateneo Art Gallery, ADMU",
    meta: "MJKL, THR-7, THU-7 · 71 students",
    warning: "Missing student participation agreements",
    warningColor: "text-crimson",
    type: "Off-Campus AFA",
    date: "Aug 17 – Sep 30, 2026",
    status: "returned",
    action: "Fix",
    highlight: true,
  },
  {
    activity: "ARTS 1 · Parola (UP Fine Arts Gallery)",
    meta: "THR-5 · 28 students",
    warning: "Evaluation form not yet answered",
    warningColor: "text-status-eval-due-text",
    warningIcon: IconClipboardText,
    type: "On-Campus AFA",
    date: "Aug 27, 2026",
    status: "evaluation-due",
    action: "Answer",
    highlight: true,
  },
  {
    activity: "Art Stud 2 · National Museum, Manila",
    meta: "WFX · 35 students",
    type: "Off-Campus AFA",
    date: "Nov 12, 2026",
    status: "dept-chair",
    action: "View",
  },
  {
    activity: "ARTS 1 · Vargas Museum, UP Diliman",
    meta: "THX-2, WFX · 52 students",
    type: "On-Campus AFA",
    date: "Nov 6, 2026",
    status: "ofa",
    action: "View",
  },
  {
    activity: "PHILARTS 1 · Metropolitan Museum, BGC",
    meta: "THV · 40 students",
    type: "Off-Campus AFA",
    date: "Sep 20, 2026",
    status: "approved",
    action: "View",
    secondaryAction: "Reuse",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const displayName = profile?.full_name ?? "Faculty Member";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <Header variant="authenticated" userInitial={userInitial} />

      <main className="bg-page-gray">
        <section className="relative isolate overflow-hidden">
          <Image
            src="/images/dashboard-banner.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/15" />

          <div className="relative mx-auto max-w-[900px] px-6 py-6 md:px-10 lg:py-8">
            <h1 className="text-[24px] font-extrabold text-white sm:text-[30px] lg:text-[34px]">
              Good afternoon, {displayName}
            </h1>
            <p className="mt-1.5 text-sm font-medium text-white/90 sm:text-base">
              1st Semester, A.Y. 2026-2027 • Faculty, College of Arts and Letters
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-control border-2 border-white px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Reuse a past AFA
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-control bg-ofa-yellow px-5 text-sm font-semibold text-navy transition-colors hover:bg-yellow-hover"
              >
                + Submit an AFA
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[900px] px-6 py-10 md:px-10">
          <div className="rounded-card border border-border-card bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#272727]">College of Arts and Letters overview</h2>
                <p className="mt-0.5 text-sm text-muted-text">This semester • Updated just now</p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 rounded-control border border-border-input px-3 py-1.5 text-xs text-[#868686] hover:bg-page-gray"
              >
                View full reports
                <IconArrowRight size={14} stroke={2} />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className={`rounded px-4 py-3 ${stat.bg}`}>
                  <p className="text-xs text-muted-text">{stat.label}</p>
                  <p className={`mt-1 text-xl font-bold ${stat.text}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-[#272727]">AFAs by type</p>
            <div className="mt-2 flex h-[15px] overflow-hidden rounded-full">
              {afaTypeBreakdown.map((item) => (
                <div
                  key={item.label}
                  className={`h-full border-r-2 border-white last:border-r-0 ${item.bar}`}
                  style={{ width: `${(item.count / totalAfas) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {afaTypeBreakdown.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className={`h-[15px] w-[15px] rounded-sm ${item.dot}`} />
                  <span className="text-sm text-[#272727]">
                    {item.label} {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-card border border-border-card bg-white p-6">
            <h2 className="text-lg font-semibold text-[#272727]">My applications</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded border border-border-input px-3 py-2">
                <IconSearch size={18} stroke={1.75} className="text-[#7e7e7e]" />
                <span className="text-sm text-[#7e7e7e]">Search course code or activity</span>
              </div>
              <div className="flex items-center gap-2 rounded border border-border-input px-3 py-2">
                <span className="text-sm text-[#7e7e7e]">A.Y. 2026-2027</span>
                <IconChevronDown size={16} stroke={1.75} className="text-[#7e7e7e]" />
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border-input px-3 py-2">
                <span className="text-sm text-[#7e7e7e]">1st Semester</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border-input px-3 py-2">
                <span className="text-sm text-[#7e7e7e]">All types</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {filterPills.map((pill) => (
                <span
                  key={pill.label}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
                    pill.active ? "bg-navy text-white" : "border border-border-input text-navy"
                  }`}
                >
                  {pill.label}
                  {pill.count !== undefined && (
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#faf1d1] text-xs text-[#b49d62]">
                      {pill.count}
                    </span>
                  )}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <div className="hidden grid-cols-[1fr_100px_130px_220px] gap-3 border-b border-border-row pb-2 text-sm font-medium text-navy sm:grid">
                <span>Activity</span>
                <span>Type</span>
                <span>Date</span>
                <span>Status</span>
              </div>

              <div>
                {applications.map((app) => {
                  const WarningIcon = app.warningIcon ?? IconAlertCircle;
                  return (
                  <div
                    key={app.activity}
                    className={`relative -mx-6 grid grid-cols-1 gap-0 border-b border-border-row px-6 py-4 pr-16 sm:grid-cols-[1fr_100px_130px_220px] sm:items-center sm:gap-3 sm:pr-6 ${
                      app.highlight ? "bg-deep-yellow-tint" : "bg-white"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy">{app.activity}</p>
                      <p className="mt-2 text-sm text-navy/70 sm:mt-0">{app.meta}</p>
                      {app.warning && (
                        <p
                          className={`mt-2 flex items-center gap-1 text-sm sm:mt-0 sm:items-start ${app.warningColor}`}
                        >
                          <WarningIcon size={14} stroke={2} className="shrink-0 sm:mt-0.5" />
                          {app.warning}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-navy sm:mt-0">{app.type}</p>
                    <p className="mt-2 text-sm text-navy sm:mt-0">{app.date}</p>
                    <div className="mt-2 flex items-center justify-between gap-2 sm:mt-0">
                    <StatusBadge status={app.status} />
                    <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3 sm:static sm:right-auto sm:top-auto sm:translate-y-0">
                      {app.action === "View" ? (
                        <Link href="/dashboard" className="text-sm text-[#868686] hover:underline">
                          View
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard"
                          className="rounded bg-navy px-3 py-1.5 text-sm text-white hover:bg-slate-navy"
                        >
                          {app.action}
                        </Link>
                      )}
                      {app.secondaryAction && (
                        <Link href="/dashboard" className="text-sm font-bold text-[#585858] underline">
                          {app.secondaryAction}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-navy">Showing 1-5 of 8</p>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-navy text-sm text-white">
                  1
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded border border-border-input text-sm text-navy">
                  2
                </span>
                <IconChevronRight size={16} stroke={2} className="text-navy" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
