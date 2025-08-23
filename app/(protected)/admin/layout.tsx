import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { UserRoleDebug } from '@/components/debug/UserRoleDebug';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: ProtectedLayoutProps) {
  return (
    <AdminRoute>
      {children}
      <UserRoleDebug />
    </AdminRoute>
  );
}
