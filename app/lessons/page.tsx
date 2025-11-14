// This is a redirect page - actual lessons management is in admin/superadmin dashboards
import { redirect } from "next/navigation";

export default function LessonsPage() {
  redirect("/dashboard");
}
