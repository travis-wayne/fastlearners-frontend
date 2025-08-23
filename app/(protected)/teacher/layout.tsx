import { AdminRoute } from '@/components/auth/ProtectedRoute';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: ProtectedLayoutProps) {
  return (
    <AdminRoute>
      {children}
    </AdminRoute>
  );
}
