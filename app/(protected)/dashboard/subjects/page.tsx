import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSubjects, getUserProfile } from "@/lib/api/subjects";
import { SubjectDashboardShell } from "@/components/dashboard/student/SubjectDashboardShell";
import { ProfileChangeBanner } from "@/components/dashboard/subjects/ProfileChangeBanner";
import { SimpleSubjectSelector } from "@/components/dashboard/subjects/SimpleSubjectSelector";

export const dynamic = "force-dynamic";

async function getUserProfileData() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return await getUserProfile(token);
  } catch (error) {
    return null;
  }
}

async function getSubjectsData() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return await getSubjects(token);
  } catch (error) {
    return null;
  }
}

export default async function SubjectsPage() {
  // Verify session validity server-side
  // Middleware already protects this route, but we verify token by fetching profile
  const profile = await getUserProfileData();

  if (!profile) {
    redirect("/auth/login");
  }

  const subjectsData = await getSubjectsData();

  const hasCompletedSelective =
    subjectsData?.selective_status === "selected" &&
    (subjectsData?.selective?.length ?? 0) > 0;

  const hasCompletedCompulsory =
    // Compulsory selective data is only returned for JSS classes
    !subjectsData ||
    !subjectsData.compulsory_selective ||
    subjectsData.compulsory_selective.length === 0 ||
    subjectsData.compulsory_selective_status === "selected";

  const hasCoreSubjects = (subjectsData?.subjects?.length ?? 0) > 0;

  const shouldShowDashboard =
    !!subjectsData && hasCoreSubjects && hasCompletedSelective && hasCompletedCompulsory;

  return (
    <div className="container mx-auto max-w-screen-2xl">
      <ProfileChangeBanner />
      {shouldShowDashboard ? (
        <SubjectDashboardShell subjectsData={subjectsData} />
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Subject Registration</h1>
            <p className="mt-2 text-muted-foreground">
              We&apos;ve pulled your academic details from your profile
              {profile.class ? ` (${profile.class}${profile.discipline ? ` • ${profile.discipline}` : ""})` : ""}.
              Review and confirm your compulsory selective and selective subjects to continue.
            </p>
          </div>
          <SimpleSubjectSelector
            initialData={subjectsData ?? undefined}
            profileClass={profile.class}
            profileDiscipline={profile.discipline}
          />
        </div>
      )}
    </div>
  );
}
