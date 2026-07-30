import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authApi } from '../api/authApi';
import { setAuth, logout as logoutAction, setInitialized } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Query to get current user (e.g., on app load)
  const useGetMe = () => {
    const query = useQuery({
      queryKey: ['me'],
      queryFn: authApi.getMe,
      retry: false,
      staleTime: Infinity, // Rely on cache unless explicitly invalidated
    });

    useEffect(() => {
      if (query.isSuccess) {
        dispatch(setAuth({ user: query.data.data }));
        dispatch(setInitialized());
      } else if (query.isError) {
        dispatch(logoutAction());
        dispatch(setInitialized());
      }
    }, [query.isSuccess, query.isError, query.data]);

    return query;
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // API returns response.data -> { success: true, message: '...', data: { user: {...}, accessToken, refreshToken } }
      dispatch(setAuth({ user: data.data.user }));
      queryClient.setQueryData(['me'], { data: data.data.user });
      router.push('/'); // Redirect after login
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      dispatch(setAuth({ user: data.data.user }));
      queryClient.setQueryData(['me'], { data: data.data.user });
      router.push('/'); // Redirect after registration
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Clean up local auth state regardless of whether the API call succeeds or fails
      dispatch(logoutAction());
      queryClient.setQueryData(['me'], null);
      queryClient.clear();
      router.push('/login');
    },
  });

  return {
    useGetMe,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
};
