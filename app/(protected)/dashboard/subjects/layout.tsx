import { DashboardBlogLayout } from "@/components/dashboard/dashboard-blog-layout";

/**
 * SubjectsLayout - Preserves blog look while serving Subjects pages.
 * Do not change layout classes without design review.
 */
export default function SubjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardBlogLayout
      title="Subjects"
      description="Select and manage your subjects"
      className="pb-16"
    >
      {children}
    </DashboardBlogLayout>
  );
}
