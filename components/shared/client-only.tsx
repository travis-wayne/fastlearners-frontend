"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const { hydrate, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
    setHasMounted(true);
  }, [hydrate, isHydrated]);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
