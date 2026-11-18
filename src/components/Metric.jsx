import { formatARS } from '../utils/formatCurrency';

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getBudgetMonthKey(createdAt) {
  const match = /^(\d{4})-(\d{2})/.exec(createdAt ?? '');
  if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) return null;
  return `${match[1]}-${match[2]}`;
}

function getPreviousMonthKey(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return getMonthKey(new Date(year, month - 2, 1));
}

function getMonthLabel(date) {
  return date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
}

function getMonthDate(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function getMonthlySpending(budgets, monthKey) {
  return budgets
    .filter((budget) => {
      return getBudgetMonthKey(budget.createdAt) === monthKey;
    })
    .reduce(
      (monthly, budget) => {
        monthly.total += Number(budget.total) || 0;
        (budget.items ?? []).forEach((item) => {
          const title = item.title || 'Gasto sin título';
          monthly.items.set(title, (monthly.items.get(title) ?? 0) + (Number(item.price) || 0));
        });
        return monthly;
      },
      { total: 0, items: new Map() },
    );
}

export default function Metric({ budgets, isLoading, hasError }) {
  if (isLoading || hasError) {
    return (
      <aside className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Gastos del mes</h2>
        <p className={`mt-3 text-sm ${hasError ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {hasError ? 'No se pudo cargar el comparativo.' : 'Calculando comparativo...'}
        </p>
      </aside>
    );
  }

  const availableMonths = budgets
    .map((budget) => getBudgetMonthKey(budget.createdAt))
    .filter(Boolean)
    .sort();
  const currentMonthKey = availableMonths.at(-1);

  if (!currentMonthKey) {
    return (
      <aside className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Comparativo mensual</h2>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Agregá presupuestos para ver la comparación entre meses.
        </p>
      </aside>
    );
  }

  const previousMonthKey = getPreviousMonthKey(currentMonthKey);
  const currentMonth = getMonthDate(currentMonthKey);
  const previousMonth = getMonthDate(previousMonthKey);
  const previous = getMonthlySpending(budgets, previousMonthKey);
  const current = getMonthlySpending(budgets, currentMonthKey);
  const difference = current.total - previous.total;
  const percentage = previous.total > 0 ? (difference / previous.total) * 100 : null;
  const changedExpenses = [...new Set([...previous.items.keys(), ...current.items.keys()])]
    .map((title) => {
      const previousAmount = previous.items.get(title) ?? 0;
      const currentAmount = current.items.get(title) ?? 0;
      return {
        title,
        previousAmount,
        currentAmount,
        difference: currentAmount - previousAmount,
      };
    })
    .filter((item) => item.difference !== 0)
    .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
    .slice(0, 8);

  return (
    <aside className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5" aria-labelledby="monthly-metric-title">
      <h2 id="monthly-metric-title" className="font-semibold text-gray-800 dark:text-gray-100">
        Comparativo mensual
      </h2>
      <p className="mt-1 text-xs capitalize text-gray-500 dark:text-gray-400">
        {getMonthLabel(currentMonth)} vs. {getMonthLabel(previousMonth)}
      </p>

      <div className="mt-5">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Total de {getMonthLabel(currentMonth)}
        </p>
        <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">{formatARS(current.total)}</p>
      </div>

      <div className={`mt-3 rounded-md px-3 py-2 text-sm ${
        difference > 0
          ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
          : difference < 0
            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
            : 'bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
      }`}>
        {difference > 0 ? (
          <>
            Gastaste {percentage === null ? 'más' : `${percentage.toFixed(1)}% más`} (
            {formatARS(difference)})
          </>
        ) : difference < 0 ? (
          <>
            Gastaste {percentage === null ? 'menos' : `${Math.abs(percentage).toFixed(1)}% menos`} (
            {formatARS(Math.abs(difference))})
          </>
        ) : (
          'Gastaste lo mismo que el mes anterior'
        )}
      </div>

      {previous.total === 0 && current.total > 0 && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          No hay gastos del mes anterior para calcular un porcentaje.
        </p>
      )}

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Gastos que variaron</h3>
        {changedExpenses.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {changedExpenses.map(({ title, previousAmount, currentAmount, difference: itemDifference }) => (
              <li key={title} className="text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 break-words text-gray-600 dark:text-gray-300">{title}</span>
                  <span className={`shrink-0 font-medium ${
                    itemDifference > 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {itemDifference > 0 ? '+' : '−'}{formatARS(Math.abs(itemDifference))}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {getMonthLabel(previousMonth)}: {formatARS(previousAmount)} → {getMonthLabel(currentMonth)}: {formatARS(currentAmount)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No hubo cambios en los gastos respecto al mes anterior.
          </p>
        )}
      </div>
    </aside>
  );
}