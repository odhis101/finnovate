import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../services/api/dashboard.api';

export const useClientDetails = () =>
  useQuery({
    queryKey: ['clientDetails'],
    queryFn: () => dashboardApi.getClientDetails().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

export const useClientAccounts = () =>
  useQuery({
    queryKey: ['clientAccounts'],
    queryFn: () => dashboardApi.getClientAccounts().then((r) => r.data.data ?? []),
    staleTime: 2 * 60 * 1000,
  });

export const useMiniStatement = (accountId?: number, productId?: number) =>
  useQuery({
    queryKey: ['miniStatement', accountId, productId],
    queryFn: () =>
      dashboardApi.getMiniStatement(accountId!, productId!).then((r) => r.data.data ?? []),
    enabled: !!accountId && !!productId,
    staleTime: 60 * 1000,
  });

export const useBalanceInquiry = (accountId?: number, productId?: number) =>
  useQuery({
    queryKey: ['balanceInquiry', accountId, productId],
    queryFn: () =>
      dashboardApi.getBalanceInquiry(accountId!, productId!).then((r) => r.data.data),
    enabled: !!accountId && !!productId,
    staleTime: 30 * 1000,
  });

export const useDashboardRefresh = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['clientAccounts'] });
    queryClient.invalidateQueries({ queryKey: ['miniStatement'] });
    queryClient.invalidateQueries({ queryKey: ['clientDetails'] });
  };
};
