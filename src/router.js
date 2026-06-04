import { getCurrentUser, isAdmin } from './services/auth.js';

// Importar Landing Page
import { LandingPage, LandingPageEvents } from './pages/LandingPage.js';

// Importar páginas de autenticación
import { Login, LoginEvents } from './pages/Login.js';

// Importar páginas de usuario
import { Home, HomeEvents } from './pages/user/Home.js';
import { DetalleCarrito, DetalleCarritoEvents } from './pages/user/DetalleCarrito.js';

// Importar páginas de admin
import { Dashboard, DashboardEvents } from './pages/admin/Dashboard.js';
import { GestionCarritos, GestionCarritosEvents } from './pages/admin/GestionCarritos.js';
import { GestionParadas, GestionParadasEvents } from './pages/admin/GestionParadas.js';
import { GestionRutas, GestionRutasEvents } from './pages/admin/GestionRutas.js';
import { GestionHorarios, GestionHorariosEvents } from './pages/admin/GestionHorarios.js';

const routes = {
  '/': { 
    component: LandingPage, 
    events: LandingPageEvents,
    requiresAuth: false 
  },
  '/login': { 
    component: Login, 
    events: LoginEvents,
    requiresAuth: false 
  },
  '/home': { 
    component: Home, 
    events: HomeEvents,
    requiresAuth: true,
    role: 'estudiante'
  },
  '/carrito/:id': { 
    component: DetalleCarrito, 
    events: DetalleCarritoEvents,
    requiresAuth: true,
    role: 'estudiante'
  },
  '/admin/dashboard': { 
    component: Dashboard, 
    events: DashboardEvents,
    requiresAuth: true,
    role: 'admin'
  },
  '/admin/carritos': { 
    component: GestionCarritos, 
    events: GestionCarritosEvents,
    requiresAuth: true,
    role: 'admin'
  },
  '/admin/paradas': { 
    component: GestionParadas, 
    events: GestionParadasEvents,
    requiresAuth: true,
    role: 'admin'
  },
  '/admin/rutas': { 
    component: GestionRutas, 
    events: GestionRutasEvents,
    requiresAuth: true,
    role: 'admin'
  },
  '/admin/horarios': { 
    component: GestionHorarios, 
    events: GestionHorariosEvents,
    requiresAuth: true,
    role: 'admin'
  }
};

function matchRoute(path) {
  for (const route in routes) {
    const routePattern = route.replace(/:[^\s/]+/g, '([\\w-]+)');
    const regex = new RegExp(`^${routePattern}$`);
    const match = path.match(regex);
    
    if (match) {
      const params = {};
      const paramNames = route.match(/:[^\s/]+/g);
      
      if (paramNames) {
        paramNames.forEach((name, index) => {
          params[name.slice(1)] = match[index + 1];
        });
      }
      
      return { route: routes[route], params };
    }
  }
  
  return null;
}

export async function router() {
  const hash = window.location.hash.slice(1) || '/';
  const app = document.getElementById('app');
  
  const user = getCurrentUser();
  const matched = matchRoute(hash);
  
  // Scroll al inicio cuando cambias de página
  window.scrollTo(0, 0);
  
  if (!matched) {
    app.innerHTML = `
      <div class="container" style="margin-top: 3rem;">
        <div class="card text-center">
          <h1 style="font-size: 3rem; margin-bottom: 1rem;">404</h1>
          <p style="color: #94a3b8; margin-bottom: 1.5rem;">Página no encontrada</p>
          <a href="#/" class="btn btn-primary">Volver al inicio</a>
        </div>
      </div>
    `;
    return;
  }
  
  const { route, params } = matched;
  
  // Verificar autenticación
  if (route.requiresAuth && !user) {
    window.location.hash = '#/login';
    return;
  }
  
  // Verificar rol
  if (route.role && user) {
    if (route.role === 'admin' && !isAdmin()) {
      window.location.hash = '#/home';
      return;
    }
    if (route.role === 'estudiante' && isAdmin()) {
      window.location.hash = '#/admin/dashboard';
      return;
    }
  }
  
  // Si está autenticado e intenta ir a landing/login, redirigir según rol
  if ((hash === '/' || hash === '/login') && user) {
    if (isAdmin()) {
      window.location.hash = '#/admin/dashboard';
    } else {
      window.location.hash = '#/home';
    }
    return;
  }
  
  // Renderizar componente
  try {
    let html;
    
    if (Object.keys(params).length > 0) {
      // Ruta con parámetros
      html = await route.component(params.id);
    } else {
      // Ruta sin parámetros
      html = await route.component();
    }
    
    app.innerHTML = html;
    
    // Ejecutar eventos
    if (route.events) {
      if (Object.keys(params).length > 0) {
        await route.events(params.id);
      } else {
        await route.events();
      }
    }
  } catch (error) {
    console.error('Error en router:', error);
    app.innerHTML = `
      <div class="container" style="margin-top: 3rem;">
        <div class="card text-center">
          <h1 style="color: #ef4444;">Error</h1>
          <p style="color: #94a3b8; margin-bottom: 1rem;">Ha ocurrido un error al cargar la página</p>
          <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem;">${error.message}</p>
          <a href="#/" class="btn btn-primary">Volver al inicio</a>
        </div>
      </div>
    `;
  }
}

// Inicializar router
export function initRouter() {
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
}