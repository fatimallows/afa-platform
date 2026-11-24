import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Button from "@/components/Button";
import TitleBand from "@/components/afa/TitleBand";
import ApplicationStatusStepper, { type ApplicationStage } from "@/components/afa/ApplicationStatusStepper";
import StatusBadge, { DB_STATUS_TO_BADGE } from "@/components/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import { getAfaTypeLabel, type AfaTypeId } from "@/components/afa/afa-types";
import { IconInfoCircle } from "@tabler/icons-react";

const KIND_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  pdf: { bg: "bg-flow-pdf-bg", text: "text-flow-red-text", label: "PDF" },
  docx: { bg: "bg-flow-docx-bg", text: "text-flow-info-icon", label: "DOCX" },
  xlsx: { bg: "bg-flow-xlsx-bg", text: "text-flow-green", label: "XLSX" },
};

export default async function ApplicationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const { data: afa } = await supabase.from("afas").select("*").eq("id", id).single();

  const displayName = profile?.full_name ?? "Faculty Member";
  const userInitial = displayName.charAt(0).toUpperCase();

  if (!afa) {
    return (
      <>
        <Header variant="authenticated" userInitial={userInitial} />
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-page-gray text-center">
          <p className="text-lg font-semibold text-navy">Application not found.</p>
          <Button href="/dashboard" variant="flow-outline-navy">
            ← Back to dashboard
          </Button>
        </main>
      </>
    );
  }

  const fields = (afa.fields ?? {}) as Record<string, string> & {
    participants?: { name: string; sex: string; degreeProgram: string }[];
  };
  const participants = Array.isArray(fields.participants) ? fields.participants : [];
  const files = (afa.files ?? []) as { name: string; kind: string; sizeLabel: string }[];
  const typeLabel = getAfaTypeLabel(afa.afa_type as AfaTypeId) ?? afa.afa_type;
  const submittedDate = new Date(afa.created_at);
  const submittedDateLabel = submittedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const submittedDateTimeLabel = submittedDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const subtitleParts = [fields.course, fields.section ? `Section ${fields.section}` : null, typeLabel, `Submitted ${submittedDateLabel}`].filter(
    Boolean,
  );

  const isReturned = afa.status === "returned";

  const infoBanner = isReturned
    ? {
        icon: <IconInfoCircle size={24} stroke={2} className="shrink-0 text-flow-red" />,
        bg: "bg-flow-red-bg border-flow-red",
        text: "text-flow-red-text",
        message: (
          <>
            <b>This application was returned.</b> Contact OFA for details on what needs to be corrected before
            resubmitting.
          </>
        ),
      }
    : afa.status === "approved"
      ? {
          icon: <IconInfoCircle size={24} stroke={2} className="shrink-0 text-flow-green" />,
          bg: "bg-flow-info-bg border-flow-info-border",
          text: "text-flow-text",
          message: <><b>This application has been approved.</b> It&apos;s now shown on your dashboard as complete.</>,
        }
      : {
          icon: <IconInfoCircle size={24} stroke={2} className="shrink-0 text-flow-info-icon" />,
          bg: "bg-flow-info-bg border-flow-info-border",
          text: "text-flow-text",
          message: (
            <>
              <b>Currently with the {afa.status === "ofa" ? "OFA" : "Department Chair"}.</b> No action needed.
              Updates are sent by email and shown on the dashboard.
            </>
          ),
        };

  return (
    <>
      <Header variant="authenticated" userInitial={userInitial} />
      <div className="min-h-screen bg-flow-page font-sans text-[17px] leading-[1.5] text-flow-text">
        <TitleBand
          breadcrumbLabel={afa.application_name}
          title={afa.application_name}
          badge={<StatusBadge status={DB_STATUS_TO_BADGE[afa.status] ?? "dept-chair"} />}
          subtitle={subtitleParts.join(" · ")}
          bannerSrc="/images/application-banner.png"
          bannerOpacity="full"
        />

        <main className="mx-auto max-w-[1280px] px-8 pb-16">
          {!isReturned && (
            <ApplicationStatusStepper stage={afa.status as ApplicationStage} submittedDateLabel={submittedDateLabel} />
          )}

          <div
            className={`mb-6 flex items-center gap-3.5 rounded-flow-control border px-5 py-4 ${infoBanner.bg} ${
              isReturned ? "-mt-[52px] shadow-[0_6px_18px_rgba(14,42,71,0.10)]" : ""
            }`}
          >
            {infoBanner.icon}
            <div className={`flex-1 ${infoBanner.text}`}>{infoBanner.message}</div>
          </div>

          <div className="flex flex-wrap items-start gap-7">
            <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
              <section className="rounded-flow-card border border-flow-border bg-white p-7">
                <h2 className="mb-[18px] text-[22px] font-bold text-flow-navy">1 · Course and schedule</h2>
                <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[15px] text-flow-muted">Academic unit</dt>
                    <dd className="m-0 mt-0.5 font-semibold">{fields.academicUnit || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-[15px] text-flow-muted">Academic year and term</dt>
                    <dd className="m-0 mt-0.5 font-semibold">{fields.academicTerm || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-[15px] text-flow-muted">Course</dt>
                    <dd className="m-0 mt-0.5 font-semibold">{fields.course || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-[15px] text-flow-muted">Section</dt>
                    <dd className="m-0 mt-0.5 font-semibold">{fields.section || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-[15px] text-flow-muted">Date/s and time/s of AFA</dt>
                    <dd className="m-0 mt-0.5 font-semibold">{fields.activityDates || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-[15px] text-flow-muted">AFA type</dt>
                    <dd className="m-0 mt-0.5 font-semibold">{typeLabel}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-flow-card border border-flow-border bg-white p-7">
                <h2 className="mb-[18px] text-[22px] font-bold text-flow-navy">2 · Activity details</h2>
                <dl className="m-0 flex flex-col gap-4">
                  <div>
                    <dt className="text-[15px] text-flow-muted">Venue</dt>
                    <dd className="m-0 mt-0.5 font-semibold">{fields.venue || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-[15px] text-flow-muted">Description of the activity</dt>
                    <dd className="m-0 mt-0.5">{fields.description || "Not provided"}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-flow-card border border-flow-border bg-white p-7">
                <h2 className="mb-[18px] text-[22px] font-bold text-flow-navy">3 · Faculty in-charge and participants</h2>
                <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[15px] text-flow-muted">Faculty in-charge</dt>
                    <dd className="m-0 mt-0.5 font-semibold">{displayName}</dd>
                  </div>
                  <div>
                    <dt className="text-[15px] text-flow-muted">UP email</dt>
                    <dd className="m-0 mt-0.5 font-semibold">{profile?.email ?? user.email}</dd>
                  </div>
                </dl>

                <p className="mb-2 mt-5 text-[15px] font-semibold text-flow-muted">Participants ({participants.length})</p>
                {participants.length === 0 ? (
                  <p className="text-flow-muted">Not provided</p>
                ) : (
                  <div className="overflow-x-auto rounded-flow-control border border-flow-field-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-flow-field-border bg-flow-page text-left">
                          <th className="px-3 py-2 font-semibold">Name</th>
                          <th className="px-3 py-2 font-semibold">Sex</th>
                          <th className="px-3 py-2 font-semibold">Degree program</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participants.map((p, i) => (
                          <tr key={i} className="border-b border-flow-field-border last:border-b-0">
                            <td className="px-3 py-2">{p.name || "—"}</td>
                            <td className="px-3 py-2">{p.sex || "—"}</td>
                            <td className="px-3 py-2">{p.degreeProgram || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="rounded-flow-card border border-flow-border bg-white p-7">
                <h2 className="mb-[18px] text-[22px] font-bold text-flow-navy">4 · Documents</h2>
                {files.length === 0 ? (
                  <p className="text-flow-muted">No documents were attached.</p>
                ) : (
                  <>
                    <ul className="flex flex-col gap-2.5">
                      {files.map((file, i) => {
                        const style = KIND_STYLE[file.kind] ?? KIND_STYLE.pdf;
                        return (
                          <li
                            key={i}
                            className="flex flex-wrap items-center gap-3.5 rounded-flow-card border border-flow-border px-4 py-3.5"
                          >
                            <span
                              className={`flex h-[30px] w-[52px] shrink-0 items-center justify-center rounded text-[13px] font-bold ${style.bg} ${style.text}`}
                            >
                              {style.label}
                            </span>
                            <span className="min-w-[200px] flex-1">
                              <b className="block">{file.name}</b>
                              <span className="text-sm text-flow-muted">{file.sizeLabel}</span>
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-3 text-sm text-flow-muted">
                      File previews and downloads aren&apos;t available in this preview yet.
                    </p>
                  </>
                )}
              </section>

              <div>
                <Button href="/dashboard" variant="flow-outline-navy">
                  ← Back to dashboard
                </Button>
              </div>
            </div>

            <aside className="flex flex-1 basis-[300px] flex-col gap-5">
              <div className="rounded-flow-card border border-flow-border bg-white p-6">
                <h2 className="mb-1 text-xl font-bold text-flow-navy">Activity history</h2>
                <p className="mb-[18px] text-[15px] text-flow-muted">
                  {files.length} document{files.length === 1 ? "" : "s"} attached
                </p>
                <ol className="m-0 flex flex-col p-0">
                  <li className="grid grid-cols-[20px_minmax(0,1fr)] gap-3">
                    <span className="flex flex-col items-center">
                      <span className="mt-[5px] h-3.5 w-3.5 rounded-full bg-flow-green" />
                    </span>
                    <span className="pb-4.5">
                      <b className="block text-base">Submitted</b>
                      <span className="text-sm text-flow-muted">
                        {displayName}
                        <br />
                        {submittedDateTimeLabel}
                      </span>
                    </span>
                  </li>
                </ol>
                <p className="text-sm text-flow-muted">
                  Further updates will appear here as this application moves through review.
                </p>
              </div>

              <div className="rounded-flow-card bg-flow-navy p-6 text-white">
                <h2 className="mb-2 text-xl font-bold">Need to change something?</h2>
                <p className="mb-3.5 text-base text-flow-banner-text">
                  Edits are not possible while under review. Contact OFA for corrections.
                </p>
                <div className="text-[15px] text-flow-banner-text">
                  ofadiliman@up.edu.ph
                  <br />
                  (632) 8981-8500 local 2059
                </div>
              </div>
            </aside>
          </div>
        </main>

        <footer className="border-t border-flow-border bg-white py-6 text-center text-[15px] text-flow-muted">
          Copyright © 2026 OFFICE OF FIELD ACTIVITIES. All rights reserved.
        </footer>
      </div>
    </>
  );
}
