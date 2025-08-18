import { sidebarLinks } from "@/config/dashboard";
import { AuthenticatedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayoutContent } from '@/components/layout/dashboard-layout-content';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: ProtectedLayoutProps) {
  return (
    <AuthenticatedRoute>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </AuthenticatedRoute>
  );
}
