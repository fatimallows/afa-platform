"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import StatusBadge, { type AfaStatus } from "@/components/StatusBadge";

export type Application = {
  id: string;
  activity: string;
  meta: string;
  type: string;
  date: string;
  status: AfaStatus;
};

type StatusFilter = "all" | "returned" | "in-review" | "approved";

const IN_REVIEW_STATUSES: AfaStatus[] = ["dept-chair", "ofa", "dean", "nstp", "evaluation-due"];

export default function ApplicationsSection({ applications }: { applications: Application[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const totalCount = applications.length;
  const returnedCount = applications.filter((a) => a.status === "returned").length;
  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const inReviewCount = applications.filter((a) => IN_REVIEW_STATUSES.includes(a.status)).length;

  const filterPills: { label: string; value: StatusFilter; count?: number }[] = [
    { label: `All ${totalCount}`, value: "all" },
    { label: "Returned", value: "returned", count: returnedCount || undefined },
    { label: "In Review", value: "in-review" },
    { label: "Approved", value: "approved" },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return applications.filter((app) => {
      const matchesQuery =
        q.length === 0 || app.activity.toLowerCase().includes(q) || app.meta.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "returned" && app.status === "returned") ||
        (statusFilter === "approved" && app.status === "approved") ||
        (statusFilter === "in-review" && IN_REVIEW_STATUSES.includes(app.status));

      return matchesQuery && matchesStatus;
    });
  }, [applications, query, statusFilter]);

  return (
    <div className="mt-6 rounded-card border border-border-card bg-white p-6">
      <h2 className="text-lg font-semibold text-[#272727]">My applications</h2>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded border border-border-input px-3 py-2">
          <IconSearch size={18} stroke={1.75} className="text-[#7e7e7e]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search course code or activity"
            className="w-full bg-transparent text-sm text-navy outline-none placeholder:text-[#7e7e7e]"
          />
        </div>
        <div className="flex items-center gap-2 rounded border border-border-input px-3 py-2 text-[#7e7e7e]">
          <span className="text-sm">All terms</span>
          <IconChevronDown size={16} stroke={1.75} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filterPills.map((pill) => (
          <button
            key={pill.value}
            type="button"
            onClick={() => setStatusFilter(pill.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
              statusFilter === pill.value ? "bg-navy text-white" : "border border-border-input text-navy hover:bg-page-gray"
            }`}
          >
            {pill.label}
            {pill.count !== undefined && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#faf1d1] text-xs text-[#b49d62]">
                {pill.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {totalCount === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-muted-text">You haven&apos;t submitted an AFA yet.</p>
          <Link
            href="/submit/step-1"
            className="inline-flex h-10 items-center justify-center rounded-control bg-ofa-yellow px-5 text-sm font-semibold text-navy transition-colors hover:bg-yellow-hover"
          >
            + Submit an AFA
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-8 py-8 text-center text-sm text-muted-text">No applications match your search or filter.</p>
      ) : (
        <>
          <div className="mt-6">
            <div className="hidden grid-cols-[1fr_100px_130px_220px] gap-3 border-b border-border-row pb-2 text-sm font-medium text-navy sm:grid">
              <span>Activity</span>
              <span>Type</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            <div>
              {filtered.map((app) => (
                <div
                  key={app.id}
                  className="relative -mx-6 grid grid-cols-1 gap-0 border-b border-border-row bg-white px-6 py-4 pr-16 sm:grid-cols-[1fr_100px_130px_220px] sm:items-center sm:gap-3 sm:pr-6"
                >
                  <div>
                    <p className="text-sm font-semibold text-navy">{app.activity}</p>
                    <p className="mt-2 text-sm text-navy/70 sm:mt-0">{app.meta}</p>
                  </div>
                  <p className="mt-2 text-sm text-navy sm:mt-0">{app.type}</p>
                  <p className="mt-2 text-sm text-navy sm:mt-0">{app.date}</p>
                  <div className="mt-2 flex items-center justify-between gap-2 sm:mt-0">
                    <StatusBadge status={app.status} />
                    <Link
                      href={`/dashboard/applications/${app.id}`}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#868686] hover:underline sm:static sm:right-auto sm:top-auto sm:translate-y-0"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-navy">
            Showing {filtered.length} of {totalCount}
          </p>
        </>
      )}
    </div>
  );
}
