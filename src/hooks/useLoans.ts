import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loansApi, type LoanApplicationPreviewPayload, type RepaymentPreviewPayload } from '../services/api/loans.api';

export const useLoanProducts = () =>
  useQuery({
    queryKey: ['loanProducts'],
    queryFn: () => loansApi.getLoanProducts().then((r) => r.data.data ?? []),
    staleTime: 5 * 60 * 1000,
  });

export const useActiveLoans = () =>
  useQuery({
    queryKey: ['activeLoans'],
    queryFn: () => loansApi.getActiveLoans(false).then((r) => r.data.data ?? []),
    staleTime: 2 * 60 * 1000,
  });

export const useLoanCalculator = (productId: number, amount: number, repaymentPeriod: number) =>
  useQuery({
    queryKey: ['loanCalculator', productId, amount, repaymentPeriod],
    queryFn: () =>
      loansApi.getLoanCalculator({ productId, amount, repaymentPeriod }).then((r) => r.data.data),
    enabled: !!productId && amount > 0 && repaymentPeriod > 0,
    staleTime: 30 * 1000,
  });

export const useLoanApplicationPreview = () =>
  useMutation({
    mutationFn: (payload: LoanApplicationPreviewPayload) =>
      loansApi.loanApplicationPreview(payload).then((r) => r.data),
  });

export const useLoanApplicationCommit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formId: number) =>
      loansApi.loanApplicationCommit(formId).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLoans'] });
      queryClient.invalidateQueries({ queryKey: ['loanProducts'] });
    },
  });
};

export const useRepaymentPreview = () =>
  useMutation({
    mutationFn: (payload: RepaymentPreviewPayload) =>
      loansApi.loanRepaymentPreview(payload).then((r) => r.data),
  });

export const useRepaymentCommit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formId: number) =>
      loansApi.loanRepaymentCommit(formId).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeLoans'] });
    },
  });
};
