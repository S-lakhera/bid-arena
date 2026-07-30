import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/authApi';
import { setAuth, logout as logoutAction, setInitialized } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Query to get current user (e.g., on app load)
  const useGetMe = () => {
    return useQuery({
      queryKey: ['me'],
      queryFn: authApi.getMe,
      retry: false,
      staleTime: Infinity, // Rely on cache unless explicitly invalidated
      onSuccess: (data) => {
        dispatch(setAuth({ user: data.data }));
      },
      onError: () => {
        dispatch(logoutAction());
      },
      onSettled: () => {
        dispatch(setInitialized());
      }
    });
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
    onSuccess: () => {
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
