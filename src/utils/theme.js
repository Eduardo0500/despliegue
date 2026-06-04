// Inicializar tema desde localStorage o usar oscuro por defecto
export function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
}

// Cambiar tema
export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Actualizar icono del botón si existe
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Toggle entre temas
export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

// Obtener tema actual
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}