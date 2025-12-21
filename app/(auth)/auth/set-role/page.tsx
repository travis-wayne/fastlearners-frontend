import { RoleSelectionForm } from "@/components/auth/RoleSelectionForm";

export default function SetRolePage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Brand/Image */}
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-[#00519C]">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex h-full flex-col items-center justify-center p-6 text-white sm:p-8 md:p-10">
            <div className="space-y-3 text-center sm:space-y-4">
              <div className="flex justify-center">
                <h2 className="text-2xl font-bold sm:text-3xl">Fast Learners</h2>
              </div>
              <p className="text-base opacity-90 sm:text-lg">
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
      <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 md:p-8 lg:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
            {/* Logo for mobile */}
            <div className="mb-6 flex justify-center sm:mb-8 lg:hidden">
              <h2 className="text-xl font-bold text-primary sm:text-2xl">Fast Learners</h2>
            </div>

            <RoleSelectionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
