"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function ProfileChangeBanner() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (user) {
      const storedClass = localStorage.getItem("lastClass");
      const storedDiscipline = localStorage.getItem("lastDiscipline");
      if (
        (storedClass && storedClass !== user.class) ||
        (storedDiscipline && storedDiscipline !== user.discipline)
      ) {
        setShowBanner(true);
      }
      // Update stored values
      localStorage.setItem("lastClass", user.class || "");
      localStorage.setItem("lastDiscipline", user.discipline || "");
    }
  }, [user]);

  if (!showBanner) return null;

  return (
    <div className="mb-4 rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700">
      <p>Your profile has changed. Subjects may have been updated.</p>
      <button
        onClick={() => {
          setShowBanner(false);
          router.refresh();
        }}
        className="mt-2 rounded bg-yellow-500 px-4 py-2 text-white"
      >
        Refresh Subjects
      </button>
    </div>
  );
}
