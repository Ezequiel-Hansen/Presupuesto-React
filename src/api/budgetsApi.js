import { supabase } from './supabaseClient';

function mapBudget(row) {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    total: (row.items ?? []).reduce((sum, i) => sum + Number(i.price), 0),
  };
}

function mapBudgetDetail(row) {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    items: (row.items ?? []).map((i) => ({
      id: i.id,
      title: i.title,
      price: Number(i.price),
    })),
  };
}

export async function getAll(year) {
  let query = supabase
    .from('budgets')
    .select('id, name, created_at, items(price)')
    .order('created_at', { ascending: false });

  if (year) {
    query = query
      .gte('created_at', `${year}-01-01`)
      .lte('created_at', `${year}-12-31T23:59:59.999`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapBudget);
}

export async function getById(id) {
  const { data, error } = await supabase
    .from('budgets')
    .select('id, name, created_at, items(id, title, price)')
    .eq('id', id)
    .order('id', { ascending: true, foreignTable: 'items' })
    .single();

  if (error) throw error;
  return mapBudgetDetail(data);
}

export async function create(name) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('budgets')
    .insert({ name, user_id: user?.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function update(id, name) {
  const { error } = await supabase.from('budgets').update({ name }).eq('id', id);
  if (error) throw error;
}

export async function remove(id) {
  const { error } = await supabase.from('budgets').delete().eq('id', id);
  if (error) throw error;
}

export async function addItem(budgetId, title, price) {
  const { data, error } = await supabase
    .from('items')
    .insert({ title, price, budget_id: budgetId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteItem(budgetId, itemId) {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)
    .eq('budget_id', budgetId);

  if (error) throw error;
}
export async function getEuro() {
    try {
        const respuesta = await fetch('https://dolarapi.com/v1/cotizaciones/eur')
        if (!respuesta.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        const json=await respuesta.json()
        return json
    } catch (error) {
        console.log(error)
    }
}