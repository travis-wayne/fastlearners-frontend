import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AcademicSetupClient } from "@/components/dashboard/subjects/AcademicSetupClient";
import { SubjectSelectionForm } from "@/components/dashboard/subjects/SubjectSelectionForm";
import { SubjectDashboardShell } from "@/components/dashboard/student/SubjectDashboardShell";
import { ProfileChangeBanner } from "@/components/dashboard/subjects/ProfileChangeBanner";
import { getUserProfile, getSubjects } from "@/lib/api/subjects";

export const dynamic = 'force-dynamic';

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

  // Check registration status
  const hasClass = !!profile.class;
  const hasSubjects = hasClass ? await getSubjectsData() : null;
  const hasRegisteredSubjects = hasSubjects && hasSubjects.subjects && hasSubjects.subjects.length > 0;

  return (
    <div className="container max-w-screen-2xl mx-auto">
      <ProfileChangeBanner />
      {!hasClass ? (
        // Step 1: Academic Setup
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome! Let's Get Started</h1>
            <p className="text-muted-foreground mt-2">
              Set up your academic profile to begin learning
            </p>
          </div>
          <AcademicSetupClient />
        </div>
      ) : !hasRegisteredSubjects ? (
        // Step 2-3: Subject Selection
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Subject Registration</h1>
            <p className="text-muted-foreground mt-2">
              Select your subjects for {profile.class}
            </p>
          </div>
          <SubjectSelectionForm classLevel={profile.class!} />
        </div>
      ) : (
        // Step 4: Dashboard
        <SubjectDashboardShell subjectsData={hasSubjects} />
      )}
    </div>
  );
}