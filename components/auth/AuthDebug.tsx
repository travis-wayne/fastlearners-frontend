'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthDebug() {
  const { user, isAuthenticated, isLoading, isHydrated, error } = useAuthStore();

  useEffect(() => {
    console.log('=== AUTH DEBUG ===');
    console.log('Auth store state:', {
      user: user ? { id: user.id, role: user.role, name: user.name, email: user.email } : null,
      isAuthenticated,
      isLoading,
      isHydrated,
      error
    });
    
    // Check localStorage directly
    const authData = localStorage.getItem('auth-storage');
    console.log('Raw localStorage data:', authData);
    
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        console.log('Parsed localStorage data:', parsed);
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
      }
    }
    
    console.log('=== END AUTH DEBUG ===');
  }, [user, isAuthenticated, isLoading, isHydrated, error]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      borderRadius: '4px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Auth Debug</strong></div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>Hydrated: {isHydrated ? 'Yes' : 'No'}</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>User: {user ? `${user.name} (${user.role[0]})` : 'None'}</div>
      {error && <div>Error: {error}</div>}
    </div>
  );
}
