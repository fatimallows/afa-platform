import Image from "next/image";
import Link from "next/link";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";

const ovcaaOfficeGroups = [
  {
    heading: "Teaching",
    offices: [
      { label: "Office for the Advancement of Teaching (OAT) Diliman", href: "https://oat.upd.edu.ph/" },
      { label: "Office of International Linkages (OIL) Diliman", href: "https://oil.upd.edu.ph/" },
    ],
  },
  {
    heading: "Curriculum",
    offices: [
      { label: "Office of the University Registrar (OUR) Diliman", href: "https://our.upd.edu.ph/" },
      { label: "National Service Training Program (NSTP) Diliman", href: "https://nstp.upd.edu.ph/" },
      { label: "General Education Center (GEC) Diliman", href: "https://gec.upd.edu.ph/" },
    ],
  },
  {
    heading: "Education Technology",
    offices: [
      { label: "University Library (UL) Diliman", href: "https://library.upd.edu.ph/" },
      { label: "Interactive Learning Center (ILC) Diliman", href: "https://ilc.upd.edu.ph/" },
    ],
  },
];

function HeadingUnderline({ width }: { width: number }) {
  return <span className="mt-2 block h-[3px] bg-crimson" style={{ width }} />;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="relative isolate overflow-hidden bg-[#121212] text-white">
        <Image src="/images/hero-bg.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#121212]/90" />

        <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 py-14 md:px-10 lg:flex-row lg:gap-14">
          <div className="lg:w-[260px] lg:shrink-0">
            <h3 className="text-[25px] font-medium">Contact Us</h3>
            <HeadingUnderline width={134} />
            <ul className="mt-5 space-y-3 text-base text-white/70">
              <li className="flex gap-2">
                <IconMapPin size={20} stroke={1.75} className="mt-0.5 shrink-0 text-white/70" />
                <span>
                  Address: 4th Floor DILC Building, R. Magsaysay Avenue corner G. Apacible St., University of
                  the Philippines Diliman, Quezon City 1101, Philippines
                </span>
              </li>
              <li className="flex gap-2">
                <IconMail size={20} stroke={1.75} className="mt-0.5 shrink-0 text-white/70" />
                <a href="mailto:ofadiliman@up.edu.ph" className="hover:underline">
                  ofadiliman@up.edu.ph
                </a>
              </li>
              <li className="flex gap-2">
                <IconPhone size={20} stroke={1.75} className="mt-0.5 shrink-0 text-white/70" />
                <span>(632) 8981-8500 local 2059</span>
              </li>
            </ul>
            <Image
              src="/images/footer-qr.png"
              alt="QR code linking to OFA Diliman"
              width={230}
              height={230}
              className="mt-6 h-[119px] w-[119px] rounded bg-white p-1.5"
            />
          </div>

          <div className="lg:flex-1">
            <h3 className="text-[25px] font-medium">OVCAA Offices</h3>
            <HeadingUnderline width={182} />
            <p className="mt-5 text-base font-bold text-white">
              OFFICE OF THE VICE-CHANCELLOR FOR ACADEMIC AFFAIRS
            </p>
            <div className="mt-4 grid gap-6 sm:grid-cols-3">
              {ovcaaOfficeGroups.map((group) => (
                <div key={group.heading}>
                  <p className="text-sm font-semibold uppercase tracking-wide text-white/60">{group.heading}</p>
                  <ul className="mt-2 space-y-2 text-base text-white/70">
                    {group.offices.map((office) => (
                      <li key={office.label}>
                        <a
                          href={office.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {office.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 lg:w-[340px] lg:shrink-0 lg:justify-end">
            <Image
              src="/images/seal-dpo-dps.png"
              alt="National Privacy Commission DPO/DPS Registered seal"
              width={174}
              height={300}
              className="h-[184px] w-auto"
            />
            <Image
              src="/images/seal-transparency.png"
              alt="Philippine Transparency Seal"
              width={150}
              height={150}
              className="h-[184px] w-[184px]"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border-card bg-white">
        <p className="mx-auto max-w-[1440px] px-6 py-5 text-center text-base text-muted-text md:px-10">
          Copyright &copy; {year}{" "}
          <a
            href="https://ofa.upd.edu.ph/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-navy"
          >
            OFFICE OF FIELD ACTIVITIES
          </a>
          . All rights reserved. <Link href="/privacy-notice" className="underline hover:text-navy">
            Privacy Notice
          </Link>
        </p>
      </div>
    </footer>
  );
}
