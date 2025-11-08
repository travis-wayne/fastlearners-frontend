"use client";

import { SubjectSelectionWizard } from "@/components/dashboard/subjects/subject-selection-wizard";
import { useToast } from "@/components/ui/use-toast";

export default function SubjectPageClient() {
  const { toast } = useToast();

  const handleComplete = () => {
    toast({
      title: "Success!",
      description: "Your subject selection has been completed successfully.",
    });
  };

  return <SubjectSelectionWizard onComplete={handleComplete} />;
}

