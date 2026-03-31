import React from "react";
import { ContentSection } from "../components/content-section";
import { ChildrenForm } from "./children-form";

export default function ChildrenPage() {
  return (
    <ContentSection
      title="Children"
      desc="Invite children and manage your monitoring requests."
    >
      <ChildrenForm />
    </ContentSection>
  );
}
