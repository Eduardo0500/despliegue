import { supabase } from '../config/supabase.js';

export const getRutas = async () => {
  const { data, error } = await supabase
    .from('rutas')
    .select(`
      *,
      ruta_paradas (
        id,
        orden,
        tiempo_estimado_minutos,
        paradas (*)
      )
    `)
    .order('nombre', { ascending: true });

  if (error) throw error;
  return data;
};

export const getRutaById = async (id) => {
  const { data, error } = await supabase
    .from('rutas')
    .select(`
      *,
      ruta_paradas (
        id,
        orden,
        tiempo_estimado_minutos,
        paradas (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  
  if (data.ruta_paradas) {
    data.ruta_paradas.sort((a, b) => a.orden - b.orden);
  }
  
  return data;
};

export const createRuta = async (ruta) => {
  const { data, error } = await supabase
    .from('rutas')
    .insert([ruta])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateRuta = async (id, ruta) => {
  const { data, error } = await supabase
    .from('rutas')
    .update(ruta)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRuta = async (id) => {
  const { error } = await supabase
    .from('rutas')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addParadaToRuta = async (rutaId, paradaId, orden, tiempoEstimado = 5) => {
  const { data, error } = await supabase
    .from('ruta_paradas')
    .insert([{
      ruta_id: rutaId,
      parada_id: paradaId,
      orden,
      tiempo_estimado_minutos: tiempoEstimado
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeParadaFromRuta = async (rutaParadaId) => {
  const { error } = await supabase
    .from('ruta_paradas')
    .delete()
    .eq('id', rutaParadaId);

  if (error) throw error;
};