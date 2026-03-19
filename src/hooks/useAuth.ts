import { useMutation } from '@tanstack/react-query';
import { authApi } from '../services/api/auth.api';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: ({ username, password, org_id }: { username: string; password: string; org_id: number }) =>
      authApi.login({ username, password, org_id }).then((r) => r.data),
    onSuccess: (data) => {
      if (data.status === 1 && data.data) {
        setAuth(data.data.token, data.data.user, data.data.last_login);
      }
    },
  });
};

export const useVerifyUser = () =>
  useMutation({
    mutationFn: (password: string) =>
      authApi.verifyUser(password).then((r) => r.data),
  });
