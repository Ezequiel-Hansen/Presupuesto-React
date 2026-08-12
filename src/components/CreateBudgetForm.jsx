import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateBudget } from '../hooks/useBudgets';

export default function CreateBudgetForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const createBudget = useCreateBudget();
  const navigate = useNavigate();

  function onSubmit(data) {
    createBudget.mutate(data.name, {
      onSuccess: () => navigate('/'),
    });
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Nuevo Presupuesto</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del presupuesto</label>
          <input
            type="text"
            {...register('name', {
              required: 'Nombre requerido',
              minLength: { value: 3, message: 'Minimo 3 caracteres' },
            })}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ej: Obra San Martin"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createBudget.isPending}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {createBudget.isPending ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}
