import { supabase } from '../config/supabase.js';

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('currentUser');
  window.location.href = '/';
};

export const login = async (email) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    const { data: newUser, error: createError } = await supabase
      .from('usuarios')
      .insert([{ email, nombre: email.split('@')[0], rol: 'estudiante' }])
      .select()
      .single();

    if (createError) throw createError;
    setCurrentUser(newUser);
    return newUser;
  }

  setCurrentUser(data);
  return data;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.rol === 'admin';
};