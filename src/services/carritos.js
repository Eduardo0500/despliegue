import { supabase } from '../config/supabase.js';

export const getCarritos = async () => {
  const { data, error } = await supabase
    .from('carritos')
    .select('*')
    .order('numero', { ascending: true });

  if (error) throw error;
  return data;
};

export const getCarritoById = async (id) => {
  const { data, error } = await supabase
    .from('carritos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createCarrito = async (carrito) => {
  const { data, error } = await supabase
    .from('carritos')
    .insert([carrito])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCarrito = async (id, carrito) => {
  const { data, error } = await supabase
    .from('carritos')
    .update(carrito)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCarrito = async (id) => {
  const { error } = await supabase
    .from('carritos')
    .delete()
    .eq('id', id);

  if (error) throw error;
};