'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
  const { useGetMe } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Try to fetch user data on mount if not already fetched
  const { isLoading } = useGetMe();

  useEffect(() => {
    // Only redirect if we know the user is definitely not authenticated 
    // after initialization has finished
    if (isInitialized && !isAuthenticated && !isLoading) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isInitialized, isLoading, pathname, router]);

  // Show loading state while checking authentication
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated (but initialized), return null as we're redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
