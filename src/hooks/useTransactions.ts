import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionsApi, type DepositPayload, type InternalTransferPreviewPayload } from '../services/api/transactions.api';

export const useServiceProviders = () =>
  useQuery({
    queryKey: ['serviceProviders'],
    queryFn: () => transactionsApi.getServiceProviders().then((r) => r.data.data ?? []),
    staleTime: Infinity,
  });

export const useDeposit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepositPayload) =>
      transactionsApi.deposit(payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientAccounts'] });
      queryClient.invalidateQueries({ queryKey: ['miniStatement'] });
    },
  });
};

export const useWithdrawal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepositPayload) =>
      transactionsApi.withdrawal(payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientAccounts'] });
      queryClient.invalidateQueries({ queryKey: ['miniStatement'] });
    },
  });
};

export const useInternalTransferPreview = () =>
  useMutation({
    mutationFn: (payload: InternalTransferPreviewPayload) =>
      transactionsApi.internalTransferPreview(payload).then((r) => r.data),
  });

export const useInternalTransferCommit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formId: number) =>
      transactionsApi.internalTransferCommit(formId).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientAccounts'] });
      queryClient.invalidateQueries({ queryKey: ['miniStatement'] });
    },
  });
};
