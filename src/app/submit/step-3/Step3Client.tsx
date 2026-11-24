"use client";

import { useState } from "react";
import { IconSparkles } from "@tabler/icons-react";
import Button from "@/components/Button";
import Field from "@/components/afa/Field";

type Props = {
  facultyName: string;
  facultyEmail: string;
};

// The course/schedule/venue values below are sample data from the handoff's
// Figma reference — there is no document-parsing backend yet to derive real
// values from uploaded files (see the standing "confirm with the prof before
// wiring real AFA data" rule). Faculty name and email come from the signed-in
// account, since that much is already real.
export default function Step3Client({ facultyName, facultyEmail }: Props) {
  const [section, setSection] = useState("WFV");
  const [participants, setParticipants] = useState("");
  const [venue, setVenue] = useState("Apacible Street, U.P. Campus, Diliman");
  const [description, setDescription] = useState(
    "Students will conduct a campus demographic survey focused on environmental research and community-based data collection, following university safety guidelines.",
  );

  return (
    <>
      <div className="mb-6 flex items-center gap-3.5 rounded-flow-control border border-flow-info-border bg-flow-info-bg px-5 py-4">
        <IconSparkles size={26} stroke={2} className="shrink-0 text-flow-info-icon" />
        <div className="flex-1">
          <b>14 of 16 fields auto-filled from uploaded files.</b>{" "}
          <span className="font-semibold text-flow-maroon">2 fields marked in red need attention.</span>
        </div>
      </div>

      <section className="rounded-flow-card border border-flow-border bg-white p-7">
        <h2 className="mb-5 text-[22px] font-bold text-flow-navy">1 · Course and schedule</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            id="academic-unit"
            label="Academic unit"
            value="College of Social Sciences and Philosophy"
            readOnly
            helper={<span className="text-flow-green">✓ From Appendix A (PDF), page 1 · <a href="#">See in file</a></span>}
          />
          <Field
            id="academic-term"
            label="Academic year and term"
            value="A.Y. 2026–2027 · First Semester"
            readOnly
            helper={<span className="text-flow-green">✓ From Appendix A (PDF), page 1 · <a href="#">See in file</a></span>}
          />
          <Field
            id="course"
            label="Course"
            value="Geog 123"
            readOnly
            helper={<span className="text-flow-green">✓ From Appendix A (PDF), page 1 · <a href="#">See in file</a></span>}
          />
          <Field
            id="section"
            label="Section"
            tone="error"
            value={section}
            onChange={setSection}
            helper={
              <span className="text-flow-red-text">PDF says &ldquo;WFV&rdquo;, Excel says &ldquo;WFW&rdquo;. Confirm the correct section.</span>
            }
          />
          <Field
            id="activity-starts"
            label="Activity starts"
            value="Wednesday, December 2, 2026"
            readOnly
            helper={<span className="text-flow-green">✓ From Appendix A (Excel) · <a href="#">See in file</a></span>}
          />
          <Field
            id="activity-ends"
            label="Activity ends"
            value="Thursday, December 3, 2026"
            readOnly
            helper={<span className="text-flow-green">✓ From Appendix A (Excel) · <a href="#">See in file</a></span>}
          />
        </div>
      </section>

      <section className="rounded-flow-card border border-flow-border bg-white p-7">
        <h2 className="mb-5 text-[22px] font-bold text-flow-navy">2 · Activity details</h2>
        <div className="flex flex-col gap-5">
          <Field
            id="venue"
            label="Venue"
            value={venue}
            onChange={setVenue}
            helper={
              <span className="text-flow-green">
                ✓ From Appendix A (PDF), page 2 · <a href="#">See in file</a> · <a href="#">Show on AFA Map</a>
              </span>
            }
          />
          <Field
            id="description"
            as="textarea"
            label="Description of the activity"
            value={description}
            onChange={setDescription}
            helper={<span className="text-flow-green">✓ From Appendix A (Word) · <a href="#">See in file</a></span>}
          />
        </div>
      </section>

      <section className="rounded-flow-card border border-flow-border bg-white p-7">
        <h2 className="mb-5 text-[22px] font-bold text-flow-navy">3 · Faculty in-charge and participants</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            id="faculty"
            label="Faculty in-charge"
            value={facultyName}
            readOnly
            helper={<span>From your UP account</span>}
          />
          <Field
            id="faculty-email"
            label="UP email"
            value={facultyEmail}
            readOnly
            helper={<span>From your UP account</span>}
          />
          <Field
            id="participants"
            label="Number of students"
            tone="error"
            value={participants}
            onChange={setParticipants}
            placeholder="Type a number"
            helper={<span className="text-flow-red-text">Not found in uploaded files.</span>}
          />
        </div>
      </section>

      <div className="flex flex-wrap justify-between gap-3">
        <Button href="/submit/step-2" variant="flow-outline-navy">
          ← Back to uploads
        </Button>
        <Button href="/submit/step-4" variant="flow-yellow">
          Continue to submit →
        </Button>
      </div>
    </>
  );
}
