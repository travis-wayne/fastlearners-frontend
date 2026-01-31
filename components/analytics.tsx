"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

export function Analytics() {
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "true") {
    return null;
  }
  return <VercelAnalytics />;
}
