import { useMutation, useQuery } from '@tanstack/react-query';
import { statementsApi, type StatementPreviewPayload } from '../services/api/statements.api';

export const useAccountStatement = (accountId?: number, productId?: number) =>
  useQuery({
    queryKey: ['accountStatement', accountId, productId],
    queryFn: () =>
      statementsApi.getAccountStatement(accountId!, productId!).then((r) => r.data.data?.transactions ?? []),
    enabled: !!accountId && !!productId,
    staleTime: 2 * 60 * 1000,
  });

export const useStatementPreview = () =>
  useMutation({
    mutationFn: (payload: StatementPreviewPayload) =>
      statementsApi.statementPreview(payload).then((r) => r.data),
  });

export const useStatementGenerate = () =>
  useMutation({
    mutationFn: (formId: number) =>
      statementsApi.statementGenerate(formId).then((r) => r.data),
  });
