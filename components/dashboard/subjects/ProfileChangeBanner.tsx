'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export function ProfileChangeBanner() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (user) {
      const storedClass = localStorage.getItem('lastClass');
      const storedDiscipline = localStorage.getItem('lastDiscipline');
      if ((storedClass && storedClass !== user.class) || (storedDiscipline && storedDiscipline !== user.discipline)) {
        setShowBanner(true);
      }
      // Update stored values
      localStorage.setItem('lastClass', user.class || '');
      localStorage.setItem('lastDiscipline', user.discipline || '');
    }
  }, [user]);

  if (!showBanner) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      <p>Your profile has changed. Subjects may have been updated.</p>
      <button onClick={() => { setShowBanner(false); router.refresh(); }} className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded">Refresh Subjects</button>
    </div>
  );
}

