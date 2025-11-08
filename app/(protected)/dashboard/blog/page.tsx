import { redirect } from "next/navigation";

/**
 * Legacy redirect page for /dashboard/blog -> /dashboard/subject
 * 
 * DEPRECATION: This redirect page should be removed once analytics show
 * negligible traffic (< 1% of total) to /dashboard/blog. Monitor for 2-3 months
 * after migration, then remove this file.
 * 
 * For a persistent redirect after removal, consider using next.config.js rewrites:
 * 
 * async rewrites() {
 *   return [
 *     {
 *       source: '/dashboard/blog',
 *       destination: '/dashboard/subject',
 *     },
 *   ];
 * }
 */
export default function BlogPage() {
  redirect("/dashboard/subject");
}
