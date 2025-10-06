import { RoleSelectionForm } from "@/components/auth/RoleSelectionForm";

export default function RoleSelectionPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Brand/Image */}
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-[#00519C]">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex h-full flex-col items-center justify-center p-10 text-white">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <h2 className="text-3xl font-bold">Fast Learners</h2>
              </div>
              <p className="text-lg opacity-90">
                Complete your registration by selecting your role
              </p>
              <div className="mt-8 space-y-2 text-sm opacity-75">
                <p>✓ Personalized learning experience</p>
                <p>✓ Progress tracking & achievements</p>
                <p>✓ Interactive lessons and activities</p>
                <p>✓ Community-driven learning</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-6xl">
            {/* Logo for mobile */}
            <div className="mb-8 flex justify-center lg:hidden">
              <h2 className="text-2xl font-bold text-primary">Fast Learners</h2>
            </div>

            <RoleSelectionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
