import { AuthenticatedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: ProtectedLayoutProps) {
  return (
    <AuthenticatedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthenticatedRoute>
  );
}
