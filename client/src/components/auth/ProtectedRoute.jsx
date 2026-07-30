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

  const { isLoading, isError, isConfirmedUnauthenticated } = useGetMe();

  useEffect(() => {
    // Only redirect if we know the user is definitely unauthenticated 
    // (e.g. 401/403) after initialization has finished
    if (isInitialized && !isAuthenticated && !isLoading && isConfirmedUnauthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isInitialized, isLoading, isConfirmedUnauthenticated, pathname, router]);

  // Show loading state while checking authentication
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle distinct non-401/403 error condition
  if (isError && !isConfirmedUnauthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-slate-900 mb-2">Connection Error</h3>
        <p className="text-slate-500 text-center mb-6">Unable to verify authentication status. Please check your connection and try again.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  // If not authenticated (but initialized and confirmed unauthenticated), return null as we're redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
