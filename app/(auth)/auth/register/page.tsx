import { RegisterForm } from '@/components/auth/RegisterForm';
import { GoogleAuthChecker } from '@/components/auth/GoogleAuthChecker';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function RegisterPage() {
  return (
    <AuthLayout subtitle="Join thousands of learners worldwide">
      <GoogleAuthChecker />
      <RegisterForm />
    </AuthLayout>
  );
}


