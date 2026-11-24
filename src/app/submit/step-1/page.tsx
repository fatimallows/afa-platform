import FlowLayout from "@/components/afa/FlowLayout";
import NeedHelpCard from "@/components/afa/NeedHelpCard";
import ApprovalProcessCard from "@/components/afa/ApprovalProcessCard";
import { getUserInitial } from "@/app/submit/get-user-initial";
import Step1Client from "./Step1Client";

export default async function Step1Page() {
  const userInitial = await getUserInitial();

  return (
    <FlowLayout
      currentStep={1}
      userInitial={userInitial}
      aside={
        <>
          <NeedHelpCard />
          <ApprovalProcessCard />
        </>
      }
    >
      <Step1Client />
    </FlowLayout>
  );
}
