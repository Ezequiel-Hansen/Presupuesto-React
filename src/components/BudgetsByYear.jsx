import { useBudgets } from '../hooks/useBudgets';
import useAuth from '../hooks/useAuth';
import BudgetCard from './BudgetCard';

export default function BudgetsByYear({ year }) {
  const { isAuthenticated } = useAuth();
  const { data: budgets, isLoading, error } = useBudgets(year);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Presupuestos {year}
      </h1>
      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400">Error al cargar</p>
      ) : budgets?.length > 0 ? (
        <div className="space-y-3">
          {budgets.map((b) => (
            <BudgetCard key={b.id} budget={b} editable={false} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10">
          No hay presupuestos en {year}
        </p>
      )}
    </div>
  );
}
