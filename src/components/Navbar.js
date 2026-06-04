import { getCurrentUser, logout, isAdmin } from '../services/auth.js';
import { toggleTheme, getCurrentTheme } from '../utils/theme.js';

export function Navbar() {
  const user = getCurrentUser();
  const currentTheme = getCurrentTheme();
  
  const handleLogout = () => {
    logout();
  };

  return `
    <nav class="navbar">
      <div class="navbar-content">
        <a href="${user ? (isAdmin() ? '#/admin/dashboard' : '#/home') : '#/'}" class="navbar-brand">
          🚌 Carritos ULEAM
        </a>
        
        <div class="navbar-menu">
          ${user ? `
            ${isAdmin() ? `
              <a href="#/admin/dashboard" class="navbar-link">Dashboard</a>
              <a href="#/admin/carritos" class="navbar-link">Carritos</a>
              <a href="#/admin/paradas" class="navbar-link">Paradas</a>
              <a href="#/admin/rutas" class="navbar-link">Rutas</a>
              <a href="#/admin/horarios" class="navbar-link">Horarios</a>
            ` : `
              <a href="#/home" class="navbar-link">Inicio</a>
            `}
            
            <button 
              id="themeToggle" 
              class="theme-toggle" 
              onclick="toggleTheme()"
              title="Cambiar tema"
            >
              ${currentTheme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            <span class="navbar-link" style="cursor: default;">👤 ${user.nombre}</span>
            <button onclick="logout()" class="btn btn-danger btn-small">Cerrar Sesión</button>
          ` : `
            <button 
              id="themeToggle" 
              class="theme-toggle" 
              onclick="toggleTheme()"
              title="Cambiar tema"
            >
              ${currentTheme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a href="#/login" class="btn btn-primary btn-small">Iniciar Sesión</a>
          `}
        </div>
      </div>
    </nav>
  `;
}

// Hacer funciones globales
window.logout = logout;
window.toggleTheme = toggleTheme;