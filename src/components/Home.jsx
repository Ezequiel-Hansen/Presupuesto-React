import { useNavigate } from 'react-router-dom';
import { useBudgets } from '../hooks/useBudgets';
import useAuth from '../hooks/useAuth';
import BudgetCard from './BudgetCard';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: budgets, isLoading, error } = useBudgets();
  const navigate = useNavigate();

  function handleCrearPresupuesto() {
    if (isAuthenticated) {
      navigate('/budgets/new');
    } else {
      navigate('/login', { state: { from: '/budgets/new' } });
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Historial</h1>
        <button
          onClick={handleCrearPresupuesto}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm cursor-pointer"
        >
          Crear Presupuesto
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Cargando presupuestos...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400">Error al cargar presupuestos</p>
      ) : budgets && budgets.length > 0 ? (
        <div className="space-y-3">
          {budgets.map((b) => (
            <BudgetCard key={b.id} budget={b} editable={isAuthenticated} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {isAuthenticated ? 'No hay presupuestos aun. Crea uno nuevo.' : 'Bienvenido a tu gestor de presupuestos'}
          </p>
          {!isAuthenticated && (
            <p className="text-gray-400 dark:text-gray-500">Inicia sesion para crear y administrar tus presupuestos</p>
          )}
        </div>
      )}
    </div>
  );
}
