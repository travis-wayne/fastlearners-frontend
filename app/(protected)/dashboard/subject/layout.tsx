import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MaxWidthWrapper className="pb-16">{children}</MaxWidthWrapper>
  );
}

