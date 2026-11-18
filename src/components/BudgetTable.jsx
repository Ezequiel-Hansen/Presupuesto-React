import { useState } from 'react';
import { formatARS } from '../utils/formatCurrency';
import { useDeleteItem, useUpdateItem } from '../hooks/useBudgets';

export default function BudgetTable({ items, editable, budgetId }) {
  const [editingItemId, setEditingItemId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const deleteItem = useDeleteItem(budgetId);
  const updateItem = useUpdateItem(budgetId);
  const total = items.reduce((sum, i) => sum + Number(i.price), 0);

  function startEditing(item) {
    setEditingItemId(item.id);
    setEditTitle(item.title);
    setEditPrice(String(item.price));
    updateItem.reset();
  }

  function cancelEditing() {
    setEditingItemId(null);
    updateItem.reset();
  }

  function handleUpdate(event, itemId) {
    event.preventDefault();
    const title = editTitle.trim();
    const price = Number(editPrice);
    if (!title || editPrice === '' || !Number.isFinite(price) || price < 0) return;

    updateItem.mutate(
      { itemId, title, price },
      { onSuccess: () => setEditingItemId(null) },
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <th className="text-left py-2 px-3 font-semibold text-gray-600 dark:text-gray-300">Titulo</th>
            <th className="text-right py-2 px-3 font-semibold text-gray-600 dark:text-gray-300 w-40">Precio</th>
            {editable && <th className="w-28" aria-label="Acciones"></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isEditing = editingItemId === item.id;

            return (
              <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-2 px-3 text-gray-800 dark:text-gray-200">
                  {isEditing ? (
                    <input
                      aria-label="Nombre del gasto"
                      type="text"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      className="w-full min-w-32 rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                  ) : item.title}
                </td>
                <td className="py-2 px-3 text-right text-gray-800 dark:text-gray-200">
                  {isEditing ? (
                    <input
                      aria-label="Monto del gasto"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editPrice}
                      onChange={(event) => setEditPrice(event.target.value)}
                      className="w-full min-w-24 rounded border border-gray-300 bg-white px-2 py-1 text-right text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                  ) : formatARS(Number(item.price))}
                </td>
                {editable && (
                  <td className="py-2 px-1 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => handleUpdate(event, item.id)}
                          disabled={updateItem.isPending || !editTitle.trim() || editPrice === '' || !Number.isFinite(Number(editPrice)) || Number(editPrice) < 0}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                        >
                          {updateItem.isPending ? '...' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          disabled={updateItem.isPending}
                          className="text-gray-500 hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          aria-label={`Editar ${item.title}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                        >
                          🖊️
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem.mutate(item.id)}
                          aria-label={`Eliminar ${item.title}`}
                          className="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 font-bold">
            <td className="py-2 px-3 text-gray-800 dark:text-gray-100">Total</td>
            <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400">{formatARS(total)}</td>
            {editable && <td></td>}
          </tr>
        </tfoot>
      </table>
      {editingItemId !== null && updateItem.isError && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          No se pudo guardar el cambio. Intenta nuevamente.
        </p>
      )}
    </div>
  );
}
