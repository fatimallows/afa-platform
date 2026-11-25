"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconChevronLeft, IconChevronRight, IconSearch } from "@tabler/icons-react";

export type AdminQueueItem = {
  id: string;
  title: string;
  subtitle: string;
  college: string;
  afaType: "Off-Campus AFA" | "On-Campus AFA" | "NSTP" | "Special AFA";
  academicYear: string;
  semester: string;
  activityInDays: number;
  status: "waiting" | "returned" | "approved";
};

type FilterTab = "waiting" | "due-soon" | "returned" | "all";

export default function AdminQueueSection({
  items,
  totalWaitingCount = 42,
  dueSoonCount = 9,
}: {
  items: AdminQueueItem[];
  totalWaitingCount?: number;
  dueSoonCount?: number;
}) {
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("A.Y. 2026-2027");
  const [selectedSemester, setSelectedSemester] = useState("1st Semester");
  const [selectedType, setSelectedType] = useState("All types");
  const [activeTab, setActiveTab] = useState<FilterTab>("waiting");
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedYear !== "All years" && item.academicYear !== selectedYear) return false;
      if (selectedSemester !== "All semesters" && item.semester !== selectedSemester) return false;
      if (selectedType !== "All types" && item.afaType !== selectedType) return false;

      if (activeTab === "waiting" && item.status !== "waiting") return false;
      if (activeTab === "due-soon" && item.activityInDays > 3) return false;
      if (activeTab === "returned" && item.status !== "returned") return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${item.title} ${item.subtitle} ${item.college} ${item.afaType}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [items, search, selectedYear, selectedSemester, selectedType, activeTab]);

  const getUrgencyBadgeStyle = (days: number) => {
    if (days <= 3) {
      return "bg-status-returned-bg text-crimson";
    }
    if (days <= 7) {
      return "bg-status-ofa-bg text-status-ofa-text";
    }
    return "bg-[#EFEFEF] text-muted-text";
  };

  return (
    <section className="mt-6 rounded-card border border-border-card bg-white p-6">
      <h2 className="text-base font-semibold text-[#272727]">Application queue</h2>

      {/* Search & Dropdown Filters */}
      <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-12">
        <div className="relative sm:col-span-5">
          <IconSearch
            size={15}
            stroke={2}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-text"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search course, faculty or location"
            className="h-9 w-full rounded-control border border-border-input bg-white pl-8 pr-3 text-xs text-[#272727] placeholder:text-muted-text focus:border-navy focus:outline-none"
          />
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          aria-label="Academic Year"
          className="h-9 rounded-control border border-border-input bg-white px-2.5 text-xs text-[#272727] focus:border-navy focus:outline-none sm:col-span-3"
        >
          <option value="A.Y. 2026-2027">A.Y. 2026-2027</option>
          <option value="A.Y. 2025-2026">A.Y. 2025-2026</option>
        </select>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          aria-label="Semester"
          className="h-9 rounded-control border border-border-input bg-white px-2.5 text-xs text-[#272727] focus:border-navy focus:outline-none sm:col-span-2"
        >
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
          <option value="Midyear">Midyear</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          aria-label="AFA Type"
          className="h-9 rounded-control border border-border-input bg-white px-2.5 text-xs text-[#272727] focus:border-navy focus:outline-none sm:col-span-2"
        >
          <option value="All types">All types</option>
          <option value="Off-Campus AFA">Off-Campus AFA</option>
          <option value="On-Campus AFA">On-Campus AFA</option>
          <option value="NSTP">NSTP</option>
          <option value="Special AFA">Special AFA</option>
        </select>
      </div>

      {/* Status Filter Pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("waiting")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "waiting"
              ? "bg-navy text-white"
              : "border border-border-input bg-white text-[#272727] hover:bg-page-gray"
          }`}
        >
          <span>Waiting for OFA</span>
          <span className="font-semibold">{totalWaitingCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("due-soon")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "due-soon"
              ? "bg-navy text-white"
              : "border border-border-input bg-white text-[#272727] hover:bg-page-gray"
          }`}
        >
          <span>Due soon</span>
          <span
            className={`rounded-full px-1.5 py-0.2 text-[11px] font-semibold ${
              activeTab === "due-soon"
                ? "bg-white/20 text-white"
                : "bg-status-returned-bg text-crimson"
            }`}
          >
            {dueSoonCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("returned")}
          className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "returned"
              ? "bg-navy text-white"
              : "border border-border-input bg-white text-[#272727] hover:bg-page-gray"
          }`}
        >
          Returned
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "all"
              ? "bg-navy text-white"
              : "border border-border-input bg-white text-[#272727] hover:bg-page-gray"
          }`}
        >
          All
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-card text-xs font-medium text-muted-text">
              <th className="pb-2.5 pr-4 font-medium">Activity</th>
              <th className="pb-2.5 pr-4 font-medium">College</th>
              <th className="pb-2.5 pr-4 font-medium">AFA Type</th>
              <th className="pb-2.5 pr-4 font-medium">Activity in</th>
              <th className="pb-2.5 text-right font-medium">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-card text-xs">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-muted-text">
                  No applications match the current filters.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-page-gray/50">
                  <td className="py-3.5 pr-4">
                    <div className="font-semibold text-[#272727]">{item.title}</div>
                    <div className="mt-0.5 text-[11px] text-muted-text">{item.subtitle}</div>
                  </td>
                  <td className="py-3.5 pr-4 font-medium text-[#272727]">{item.college}</td>
                  <td className="py-3.5 pr-4 text-[#272727]">{item.afaType}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-flex items-center rounded px-2.5 py-1 text-[11px] font-semibold ${getUrgencyBadgeStyle(
                        item.activityInDays,
                      )}`}
                    >
                      {item.activityInDays} days
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/dashboard/applications/${item.id}`}
                      className="inline-flex h-7 items-center justify-center rounded-control bg-navy px-3.5 text-xs font-semibold text-white transition-colors hover:bg-slate-navy"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-card pt-3.5 text-xs text-muted-text">
        <span>
          Showing 1–{filteredItems.length} of{" "}
          {activeTab === "waiting" ? totalWaitingCount : filteredItems.length}
        </span>

        <div className="flex items-center gap-1">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`flex h-6 w-6 items-center justify-center rounded text-xs font-medium ${
                page === p
                  ? "bg-navy text-white"
                  : "border border-border-input bg-white text-[#272727] hover:bg-page-gray"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(3, p + 1))}
            aria-label="Next page"
            className="flex h-6 w-6 items-center justify-center rounded border border-border-input bg-white text-[#272727] hover:bg-page-gray"
          >
            <IconChevronRight size={13} stroke={2} />
          </button>
        </div>
      </div>
    </section>
  );
}