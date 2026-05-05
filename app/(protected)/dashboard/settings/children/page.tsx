import { ContentSection } from "../components/content-section";
import { ChildrenForm } from "./children-form";

export default function ChildrenPage() {
  return (
    <ContentSection
      title="Children"
      desc="Invite and manage children monitoring requests."
    >
      <ChildrenForm />
    </ContentSection>
  );
}
