import { supabase } from '../config/supabase.js';

export const getHorarios = async () => {
  const { data, error } = await supabase
    .from('horarios')
    .select(`
      *,
      carritos (*),
      rutas (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getHorariosByCarrito = async (carritoId) => {
  const { data, error } = await supabase
    .from('horarios')
    .select(`
      *,
      rutas (*)
    `)
    .eq('carrito_id', carritoId);

  if (error) throw error;
  return data;
};

export const createHorario = async (horario) => {
  const { data, error } = await supabase
    .from('horarios')
    .insert([horario])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateHorario = async (id, horario) => {
  const { data, error } = await supabase
    .from('horarios')
    .update(horario)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteHorario = async (id) => {
  const { error } = await supabase
    .from('horarios')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getPosicionCarrito = async (carritoId) => {
  const { data, error } = await supabase
    .from('posiciones')
    .select('*')
    .eq('carrito_id', carritoId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updatePosicionCarrito = async (carritoId, latitud, longitud) => {
  const { data, error } = await supabase
    .from('posiciones')
    .insert([{
      carrito_id: carritoId,
      latitud,
      longitud
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};