import { SubmitFlowProvider } from "@/app/submit/flow-context";
import FlowLayout from "@/components/afa/FlowLayout";
import Step2Client from "@/app/submit/step-2/Step2Client";

export default function PreviewFlowLayout() {
  return (
    <SubmitFlowProvider>
      <FlowLayout currentStep={2}>
        <Step2Client />
      </FlowLayout>
    </SubmitFlowProvider>
  );
}
