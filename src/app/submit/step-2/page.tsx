import FlowLayout from "@/components/afa/FlowLayout";
import NeedHelpCard from "@/components/afa/NeedHelpCard";
import ApprovalProcessCard from "@/components/afa/ApprovalProcessCard";
import { getUserInitial } from "@/app/submit/get-user-initial";
import Step2Client from "./Step2Client";

export default async function Step2Page() {
  const userInitial = await getUserInitial();

  return (
    <FlowLayout
      currentStep={2}
      userInitial={userInitial}
      aside={
        <>
          <NeedHelpCard />
          <ApprovalProcessCard />
        </>
      }
    >
      <Step2Client />
    </FlowLayout>
  );
}
