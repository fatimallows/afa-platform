import Button from "@/components/Button";

export default function NeedHelpCard() {
  return (
    <div className="rounded-flow-card bg-flow-navy p-6 text-white">
      <h2 className="mb-2 text-xl font-bold">Need help?</h2>
      <Button
        href="https://ofa.upd.edu.ph/about-afas"
        target="_blank"
        rel="noopener noreferrer"
        variant="flow-white"
        className="w-full"
      >
        Open Submission Guide
      </Button>
      <Button href="/dashboard" variant="flow-outline-white" className="mt-2.5 w-full">
        Download blank forms
      </Button>
      <div className="mt-4 text-[15px] text-flow-banner-text">
        ofadiliman@up.edu.ph
        <br />
        (632) 8981-8500 local 2059
      </div>
    </div>
  );
}
