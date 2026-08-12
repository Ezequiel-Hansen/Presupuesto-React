import { useForm } from 'react-hook-form';

export default function AddItemForm({ onSubmit, loading }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  function handleFormSubmit(data) {
    onSubmit(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex items-end gap-3">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Titulo</label>
        <input
          type="text"
          {...register('title', { required: 'Requerido' })}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ej: Bolsa de cemento"
        />
        {errors.title && <p className="text-red-500 text-xs mt-0.5">{errors.title.message}</p>}
      </div>

      <div className="w-32">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Precio ($)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          {...register('price', { required: 'Requerido', min: { value: 0, message: 'Minimo 0' }, valueAsNumber: true })}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="0.00"
        />
        {errors.price && <p className="text-red-500 text-xs mt-0.5">{errors.price.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
      >
        {loading ? '...' : 'Agregar'}
      </button>
    </form>
  );
}
