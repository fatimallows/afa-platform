import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import AdminQueueSection, { type AdminQueueItem } from "./AdminQueueSection";

const STATS = [
  { label: "Total AFAs", value: "415", bg: "bg-[#E8E8E8]", text: "text-[#272727]" },
  { label: "Approved", value: "364", bg: "bg-teal-tint", text: "text-status-approved-text" },
  { label: "Waiting for OFA", value: "42", bg: "bg-status-ofa-bg", text: "text-status-ofa-text" },
  { label: "Due in 3 days", value: "9", bg: "bg-status-returned-bg", text: "text-crimson" },
  {
    label: "Avg. processing",
    value: "3.2",
    suffix: "days",
    bg: "bg-[#E8E8E8]",
    text: "text-[#272727]",
  },
];

const AFA_TYPE_BREAKDOWN = [
  { label: "Off-campus", count: 199, color: "bg-teal" },
  { label: "On-campus", count: 197, color: "bg-periwinkle" },
  { label: "NSTP", count: 16, color: "bg-deep-yellow" },
  { label: "Special", count: 2, color: "bg-crimson" },
  { label: "International", count: 1, color: "bg-navy" },
];

const TOP_COLLEGES = [
  { code: "CAL", count: 84 },
  { code: "COE", count: 72 },
  { code: "CMC", count: 58 },
  { code: "CS", count: 51 },
  { code: "CHE", count: 39 },
];

const MOCK_QUEUE: AdminQueueItem[] = [
  {
    id: "1",
    title: "Geol 150 · Iba, Zambales",
    subtitle: "Prof. Reyes · THX · 24 students",
    college: "CS",
    afaType: "Off-Campus AFA",
    academicYear: "A.Y. 2026-2027",
    semester: "1st Semester",
    activityInDays: 2,
    status: "waiting",
  },
  {
    id: "2",
    title: "Arts 101 · CCP, Pasay",
    subtitle: "Prof. Lim · WFY · 30 students",
    college: "CAL",
    afaType: "Special AFA",
    academicYear: "A.Y. 2026-2027",
    semester: "1st Semester",
    activityInDays: 2,
    status: "waiting",
  },
  {
    id: "3",
    title: "CE 121 · Malolos, Bulacan",
    subtitle: "Prof. Garcia · TFR · 45 students",
    college: "COE",
    afaType: "Off-Campus AFA",
    academicYear: "A.Y. 2026-2027",
    semester: "1st Semester",
    activityInDays: 5,
    status: "waiting",
  },
  {
    id: "4",
    title: "NSTP 1 · Barangay UP Campus, QC",
    subtitle: "Prof. Tan · WFU · 38 students",
    college: "CMC",
    afaType: "NSTP",
    academicYear: "A.Y. 2026-2027",
    semester: "1st Semester",
    activityInDays: 14,
    status: "waiting",
  },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "OFA Admin";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    displayName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "OFA Admin";
  }

  const userInitial = displayName.charAt(0).toUpperCase();

  const totalTypesCount = AFA_TYPE_BREAKDOWN.reduce((sum, item) => sum + item.count, 0);
  const maxCollegeCount = Math.max(...TOP_COLLEGES.map((c) => c.count));

  return (
    <div className="flex min-h-screen flex-col bg-page-gray">
      <Header variant="authenticated" userInitial={userInitial} />

      <main className="flex-1 bg-page-gray">
        {/* Hero Banner */}
        <section className="relative isolate overflow-hidden">
          <Image src="/images/dashboard-banner.jpg" alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-navy/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/15" />

          <div className="relative mx-auto max-w-[900px] px-6 py-6 md:px-10 lg:py-8">
            <h1 className="text-[24px] font-extrabold text-white sm:text-[30px] lg:text-[34px]">
              Good afternoon, {displayName}
            </h1>
            <p className="mt-1.5 text-sm font-medium text-white/90 sm:text-base">
              1st Semester, A.Y. 2026–2027 • OFA Admin
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-control border-2 border-white px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Export Report
              </button>
              <Link
                href="/dashboard/applications/1"
                className="inline-flex h-10 items-center justify-center rounded-control bg-ofa-yellow px-5 text-sm font-semibold text-navy transition-colors hover:bg-yellow-hover"
              >
                Review next AFA
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content Container */}
        <div className="mx-auto max-w-[900px] px-6 py-8 md:px-10">
          {/* University-wide Overview Card */}
          <section className="rounded-card border border-border-card bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-[#272727]">University-wide overview</h2>
                <p className="mt-0.5 text-xs text-muted-text">This semester • Updated just now</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  aria-label="Filter by college"
                  defaultValue="All colleges"
                  className="h-8 rounded-control border border-border-input bg-white px-3 text-xs text-[#272727] focus:border-navy focus:outline-none"
                >
                  <option value="All colleges">All colleges</option>
                  <option value="CAL">CAL</option>
                  <option value="COE">COE</option>
                  <option value="CMC">CMC</option>
                  <option value="CS">CS</option>
                  <option value="CHE">CHE</option>
                </select>

                <Link
                  href="/admin"
                  className="inline-flex h-8 items-center gap-1 rounded-control border border-border-input px-3 text-xs text-[#868686] hover:bg-page-gray"
                >
                  View full reports
                  <IconArrowRight size={13} stroke={2} />
                </Link>
              </div>
            </div>

            {/* 5 KPI Tiles */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {STATS.map((stat) => (
                <div key={stat.label} className={`rounded px-3.5 py-3 ${stat.bg}`}>
                  <p className="text-[11px] text-muted-text">{stat.label}</p>
                  <p className={`mt-1 text-xl font-bold ${stat.text}`}>
                    {stat.value}
                    {stat.suffix && (
                      <span className="ml-1 text-xs font-normal text-muted-text">
                        {stat.suffix}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Breakdown Split: AFAs by type + AFAs by college */}
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <p className="text-xs font-medium text-[#272727]">AFAs by type</p>
                    <div className="mt-2.5 flex h-[15px] overflow-hidden rounded-full bg-[#EFEFEF]">
                    {AFA_TYPE_BREAKDOWN.map((item) => (
                        <div
                        key={item.label}
                        title={`${item.label}: ${item.count}`}
                        className={`h-full min-w-[6px] border-r-2 border-white last:border-r-0 ${item.color}`}
                        style={{ width: `${(item.count / totalTypesCount) * 100}%` }}
                        />
                    ))}
                    </div>
                    <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
                    {AFA_TYPE_BREAKDOWN.map((item) => (
                        <div key={item.label} className="flex items-center gap-1.5">
                        <span className={`h-3 w-3 shrink-0 rounded-sm ${item.color}`} />
                        <span className="text-xs text-[#272727]">
                            {item.label} ({item.count})
                        </span>
                        </div>
                    ))}
                    </div>
                </div>

              <div>
                <p className="text-xs font-medium text-[#272727]">AFAs by college (top 5)</p>
                <div className="mt-2.5 flex flex-col gap-2">
                  {TOP_COLLEGES.map((college) => (
                    <div key={college.code} className="flex items-center gap-3 text-xs">
                      <span className="w-10 font-medium text-muted-text">{college.code}</span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#EFEFEF]">
                        <div
                          className="h-full rounded-full bg-navy"
                          style={{ width: `${(college.count / maxCollegeCount) * 100}%` }}
                        />
                      </div>
                      <span className="w-7 text-right font-semibold text-[#272727]">
                        {college.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Application Queue */}
          <AdminQueueSection items={MOCK_QUEUE} totalWaitingCount={42} dueSoonCount={9} />
        </div>
      </main>

      <footer className="border-t border-border-card bg-white py-5 text-center text-xs text-muted-text">
        Copyright © 2026 OFFICE OF FIELD ACTIVITIES. All rights reserved.
      </footer>
    </div>
  );
}