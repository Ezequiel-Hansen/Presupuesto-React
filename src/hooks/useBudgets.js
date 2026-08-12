import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as budgetsApi from '../api/budgetsApi';

export function useBudgets(year, options = {}) {
  return useQuery({
    queryKey: year ? ['budgets', 'year', year] : ['budgets'],
    queryFn: () => budgetsApi.getAll(year),
    ...options,
  });
}

export function useBudget(id) {
  return useQuery({
    queryKey: ['budgets', id],
    queryFn: () => budgetsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name) => budgetsApi.create(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useDeleteBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: budgetsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useAddItem(budgetId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ title, price }) => budgetsApi.addItem(budgetId, title, price),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets', budgetId] }),
  });
}

export function useDeleteItem(budgetId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId) => budgetsApi.deleteItem(budgetId, itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets', budgetId] }),
  });
}




export function useEuro() {
    return useQuery({
        queryKey: ['euro'],
        queryFn: budgetsApi.getEuro,
    })
}
