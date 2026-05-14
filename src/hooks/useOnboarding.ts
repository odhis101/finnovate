import { useMutation, useQuery } from '@tanstack/react-query';
import { onboardingApi, type KYCInitialPayload, type KYCFinalPayload } from '../services/api/onboarding.api';
import { authApi } from '../services/api/auth.api';
import { useOnboardingStore } from '../store/onboardingStore';

export const useOrganisations = () =>
  useQuery({
    queryKey: ['organisations'],
    queryFn: () => onboardingApi.getOrganisations().then((r) => r.data.data ?? []),
    staleTime: Infinity,
  });

export const useGenders = (orgId: number) =>
  useQuery({
    queryKey: ['genders', orgId],
    queryFn: () => onboardingApi.getGenders(orgId).then((r) => r.data.data ?? []),
    enabled: !!orgId,
    staleTime: Infinity,
  });

export const useGroups = (orgId: number) =>
  useQuery({
    queryKey: ['groups', orgId],
    queryFn: () => onboardingApi.getGroups(orgId).then((r) => r.data.data ?? []),
    enabled: !!orgId,
    staleTime: Infinity,
  });

export const useGetAssociatedOrgs = () =>
  useMutation({
    mutationFn: ({ phone, nationalIdNumber, notYetJoined }: { phone: string; nationalIdNumber: string; notYetJoined?: boolean }) =>
      authApi.getAssociatedOrgs(phone, nationalIdNumber, notYetJoined).then((r) => r.data),
  });

export const useActivate = () =>
  useMutation({
    mutationFn: (phone: string) =>
      authApi.activate(phone).then((r) => r.data),
  });

export const useVerifyCode = () =>
  useMutation({
    mutationFn: (token: string) =>
      authApi.verifyCode(token).then((r) => r.data),
  });

export const useResendOtp = () =>
  useMutation({
    mutationFn: (username: string) =>
      authApi.resendOtp(username).then((r) => r.data),
  });

export const useCreateClientInitial = () =>
  useMutation({
    mutationFn: (payload: KYCInitialPayload) =>
      onboardingApi.createClientInitial(payload).then((r) => r.data),
  });

export const useCreateClientFinal = () => {
  const setUsername = useOnboardingStore((s) => s.setUsername);

  return useMutation({
    mutationFn: (payload: KYCFinalPayload) =>
      onboardingApi.createClientFinal(payload).then((r) => r.data),
    onSuccess: (data) => {
      if (data.data?.username) {
        setUsername(data.data.username);
      }
    },
  });
};

export const useValidateDefaultPin = () =>
  useMutation({
    mutationFn: ({ username, defaultPin }: { username: string; defaultPin: string }) =>
      authApi.validateDefaultPin(username, defaultPin).then((r) => r.data),
  });

export const useChangeDefaultPin = () => {
  const reset = useOnboardingStore((s) => s.reset);

  return useMutation({
    mutationFn: ({ username, password, confirm }: { username: string; password: string; confirm: string }) =>
      authApi.changeDefaultPin(username, password, confirm).then((r) => r.data),
    onSuccess: () => {
      reset();
    },
  });
};
