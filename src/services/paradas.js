import { supabase } from '../config/supabase.js';

export const getParadas = async () => {
  const { data, error } = await supabase
    .from('paradas')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) throw error;
  return data;
};

export const getParadaById = async (id) => {
  const { data, error } = await supabase
    .from('paradas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createParada = async (parada) => {
  const { data, error } = await supabase
    .from('paradas')
    .insert([parada])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateParada = async (id, parada) => {
  const { data, error } = await supabase
    .from('paradas')
    .update(parada)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteParada = async (id) => {
  const { error } = await supabase
    .from('paradas')
    .delete()
    .eq('id', id);

  if (error) throw error;
};