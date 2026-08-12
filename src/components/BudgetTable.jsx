import { formatARS } from '../utils/formatCurrency';
import { useDeleteItem } from '../hooks/useBudgets';

export default function BudgetTable({ items, editable, budgetId }) {
  const deleteItem = useDeleteItem(budgetId);
  const total = items.reduce((sum, i) => sum + Number(i.price), 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <th className="text-left py-2 px-3 font-semibold text-gray-600 dark:text-gray-300">Titulo</th>
            <th className="text-right py-2 px-3 font-semibold text-gray-600 dark:text-gray-300 w-40">Precio</th>
            {editable && <th className="w-10"></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="py-2 px-3 text-gray-800 dark:text-gray-200">{item.title}</td>
              <td className="py-2 px-3 text-right text-gray-800 dark:text-gray-200">{formatARS(Number(item.price))}</td>
              {editable && (
                <td className="py-2 px-1 text-center">
                  <button
                    onClick={() => deleteItem.mutate(item.id)}
                    className="text-red-300 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                  >
                    ✕
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 font-bold">
            <td className="py-2 px-3 text-gray-800 dark:text-gray-100">Total</td>
            <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400">{formatARS(total)}</td>
            {editable && <td></td>}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
