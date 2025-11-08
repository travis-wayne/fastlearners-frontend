import { constructMetadata } from "@/lib/utils";
import SubjectPageClient from "./page.client";

export const metadata = constructMetadata({
  title: "Subject Selection",
  description: "Select your subjects for the academic year.",
});

export default function SubjectPage() {
  return <SubjectPageClient />;
}

