import { ContentSection } from "../components/content-section";
import { DisplayForm } from "./display-form";

export default function SettingsBillingPage() {
  return (
    <ContentSection
      title="Billing"
      desc="Manage your account preferences and subscription."
    >
      <DisplayForm />
    </ContentSection>
  );
}
