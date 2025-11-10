import { DashboardBlogLayout } from "@/components/dashboard/dashboard-blog-layout";

/**
 * LessonsLayout - Preserves blog look while serving Lessons pages.
 * Do not change layout classes without design review.
 */
export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardBlogLayout
      title="Lessons"
      description="Explore and learn from interactive lessons"
      className="pb-16"
    >
      {children}
    </DashboardBlogLayout>
  );
}
