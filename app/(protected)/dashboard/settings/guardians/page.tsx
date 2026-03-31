import React from "react";
import { ContentSection } from "../components/content-section";
import { GuardiansForm } from "./guardians-form";

export default function GuardiansPage() {
  return (
    <ContentSection
      title="Guardians"
      desc="Manage guardian requests and monitor who can view your progress."
    >
      <GuardiansForm />
    </ContentSection>
  );
}
