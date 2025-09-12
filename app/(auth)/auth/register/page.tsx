import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleAuthChecker } from "@/components/auth/GoogleAuthChecker";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout subtitle="Join thousands of learners worldwide">
      <GoogleAuthChecker />
      <RegisterForm />
    </AuthLayout>
  );
}
