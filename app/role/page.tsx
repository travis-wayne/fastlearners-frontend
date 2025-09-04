import { RoleSelectionForm } from "@/components/auth/RoleSelectionForm";

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-6xl">
        <RoleSelectionForm />
      </div>
    </div>
  );
}
