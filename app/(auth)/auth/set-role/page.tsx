import { RoleSelectionForm } from "@/components/auth/RoleSelectionForm";

export default function SetRolePage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Brand/Image */}
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-[#00519C]">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex h-full flex-col items-center justify-center p-component-lg text-white sm:p-component-xl">
            <div className="space-y-component-sm text-center sm:space-y-component-md">
              <div className="flex justify-center">
                <h2 className="text-2xl font-bold sm:text-3xl">Fast Learners</h2>
              </div>
              <p className="text-base opacity-90 sm:text-heading-lg">
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
      <div className="flex flex-col gap-component-md p-component-md sm:gap-component-lg sm:p-component-lg lg:p-component-xl">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
            {/* Logo for mobile */}
            <div className="mb-component-lg flex justify-center sm:mb-component-xl lg:hidden">
              <h2 className="text-heading-xl font-bold text-primary sm:text-2xl">Fast Learners</h2>
            </div>

            <RoleSelectionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
