import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import Header from "@/components/Header";
import { DB_STATUS_TO_BADGE } from "@/components/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { getAfaTypeLabel, type AfaTypeId } from "@/components/afa/afa-types";
import ApplicationsSection, { type Application } from "./ApplicationsSection";

const TYPE_COLORS = ["bg-teal", "bg-periwinkle", "bg-orange", "bg-deep-yellow", "bg-crimson", "bg-navy", "bg-slate-navy"];

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
    .select("full_name, email, college")
    .eq("id", user.id)
    .single();

  const { data: afaRows } = await supabase
    .from("afas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const displayName = profile?.full_name ?? "Faculty Member";
  const userInitial = displayName.charAt(0).toUpperCase();
  const college = profile?.college ?? "College of Science";

  const applications: Application[] = (afaRows ?? []).map((row) => {
    const fields = (row.fields ?? {}) as Record<string, string> & { participants?: unknown };
    const participantCount = Array.isArray(fields.participants) ? fields.participants.length : 0;
    const metaParts = [
      fields.course,
      fields.section ? `Section ${fields.section}` : null,
      participantCount > 0 ? `${participantCount} students` : null,
    ].filter(Boolean);

    return {
      id: row.id,
      activity: row.application_name,
      meta: metaParts.join(" · ") || "No course details yet",
      type: getAfaTypeLabel(row.afa_type as AfaTypeId) ?? row.afa_type,
      date: new Date(row.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: DB_STATUS_TO_BADGE[row.status] ?? "dept-chair",
    };
  });

  const totalCount = applications.length;
  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const returnedCount = applications.filter((a) => a.status === "returned").length;
  const inReviewCount = totalCount - approvedCount - returnedCount;

  const stats = [
    { label: "Total AFAs", value: totalCount, bg: "bg-[#E8E8E8]", text: "text-muted-text" },
    { label: "Approved", value: approvedCount, bg: "bg-teal-tint", text: "text-status-approved-text" },
    { label: "In Review", value: inReviewCount, bg: "bg-status-ofa-bg", text: "text-status-ofa-text" },
    { label: "Returned", value: returnedCount, bg: "bg-status-returned-bg", text: "text-crimson" },
  ];

  const typeCounts = new Map<string, number>();
  applications.forEach((a) => typeCounts.set(a.type, (typeCounts.get(a.type) ?? 0) + 1));
  const afaTypeBreakdown = Array.from(typeCounts.entries()).map(([label, count], i) => ({
    label,
    count,
    color: TYPE_COLORS[i % TYPE_COLORS.length],
  }));

  return (
    <>
      <Header variant="authenticated" userInitial={userInitial} />

      <main className="bg-page-gray">
        <section className="relative isolate overflow-hidden">
          <Image src="/images/dashboard-banner.jpg" alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-navy/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/15" />

          <div className="relative mx-auto max-w-[900px] px-6 py-6 md:px-10 lg:py-8">
            <h1 className="text-[24px] font-extrabold text-white sm:text-[30px] lg:text-[34px]">
              Good afternoon, {displayName}
            </h1>
            <p className="mt-1.5 text-sm font-medium text-white/90 sm:text-base">Faculty · {college}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-control border-2 border-white px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Reuse a past AFA
              </Link>
              <Link
                href="/submit/step-1"
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
                <h2 className="text-base font-semibold text-[#272727]">{college} overview</h2>
                <p className="mt-0.5 text-sm text-muted-text">Updated just now</p>
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

            {totalCount > 0 ? (
              <>
                <p className="mt-6 text-sm text-[#272727]">AFAs by type</p>
                <div className="mt-2 flex h-[15px] overflow-hidden rounded-full">
                  {afaTypeBreakdown.map((item) => (
                    <div
                      key={item.label}
                      className={`h-full border-r-2 border-white last:border-r-0 ${item.color}`}
                      style={{ width: `${(item.count / totalCount) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {afaTypeBreakdown.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className={`h-[15px] w-[15px] rounded-sm ${item.color}`} />
                      <span className="text-sm text-[#272727]">
                        {item.label} {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-6 text-sm text-muted-text">No AFAs submitted yet — once you do, a breakdown by type shows up here.</p>
            )}
          </div>

          <ApplicationsSection applications={applications} />
        </div>
      </main>
    </>
  );
}
