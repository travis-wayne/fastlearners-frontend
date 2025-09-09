import { AuthenticatedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { isInitialized, isLoading } = useAuthInit();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter(
      ({ authorizeOnly }) => {
        if (!authorizeOnly) return true;
        if (!user.role) return false;
        // Convert enum to string for comparison with user.role array from API
        const roleString = authorizeOnly.toLowerCase();
        return user.role.includes(roleString as any);
      }
    ),
  }));

  return (
    <AuthenticatedRoute>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </AuthenticatedRoute>
  );
}
