import { useState } from 'react';
import { useBudget, useDeleteBudget, useAddItem, useEuro } from '../hooks/useBudgets';
import { formatARS } from '../utils/formatCurrency';
import BudgetTable from './BudgetTable';
import AddItemForm from './AddItemForm';
import { TrashIcon } from '../utils/icons.js';

export default function BudgetCard({ budget, editable }) {
  const [expanded, setExpanded] = useState(false);
  const { data: fullBudget, isLoading: isLoadingBudget } = useBudget(expanded ? budget.id : null);
  const deleteBudget = useDeleteBudget();
  const addItem = useAddItem(editable ? budget.id : null);
  const { data: euroData, isLoading: isLoadingEuro, isError: isErrorEuro } = useEuro();
  const items = fullBudget?.items || [];

  function handleDeleteBudget(e) {
    e.stopPropagation();
    if (window.confirm('Eliminar este presupuesto?')) {
      deleteBudget.mutate(budget.id);
    }
  }

  function handleAddItem(data) {
    addItem.mutate({ title: data.title, price: Number(data.price) });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-800 dark:text-gray-100">{budget.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{budget.createdAt?.slice(0, 10)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-xs text-gray-400 dark:text-gray-500">
            {isLoadingEuro && 'Cargando...'}
            {isErrorEuro && 'Error al obtener cotización'}
            {`${(budget.total/euroData?.compra).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })} (aprox)`}
          </div>
          <span className="font-bold text-blue-600 dark:text-blue-400">{formatARS(budget.total)}</span>
          {editable && (
            <button
              onClick={handleDeleteBudget}
              className="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm cursor-pointer"
            >
              <TrashIcon height='28' />
            </button>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-4">
          {isLoadingBudget ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">Cargando items...</p>
          ) : (
            <>
              <BudgetTable items={items} editable={editable} budgetId={budget.id} />
              {editable && (
                <>
                  <AddItemForm onSubmit={handleAddItem} loading={addItem.isPending} />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}