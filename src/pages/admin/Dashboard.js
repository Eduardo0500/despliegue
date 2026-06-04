import { Navbar } from '../../components/Navbar.js';
import { getCarritos } from '../../services/carritos.js';
import { getParadas } from '../../services/paradas.js';
import { getRutas } from '../../services/rutas.js';
import { getHorarios } from '../../services/horarios.js';
import { showLoading, closeLoading } from '../../utils/helpers.js';

export async function Dashboard() {
  showLoading();
  
  try {
    const [carritos, paradas, rutas, horarios] = await Promise.all([
      getCarritos(),
      getParadas(),
      getRutas(),
      getHorarios()
    ]);
    
    const carritosActivos = carritos.filter(c => c.estado === 'activo').length;
    
    closeLoading();
    
    return `
      ${Navbar()}
      <div class="container fade-in">
        <div class="dashboard-header">
          <h1 class="dashboard-title">📊 Dashboard Administrativo</h1>
          <p class="dashboard-subtitle">Panel de control del sistema de carritos</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Carritos</div>
            <div class="stat-value">${carritos.length}</div>
            <div class="badge badge-success">${carritosActivos} activos</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Paradas Registradas</div>
            <div class="stat-value">${paradas.length}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Rutas Configuradas</div>
            <div class="stat-value">${rutas.length}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-label">Horarios Activos</div>
            <div class="stat-value">${horarios.length}</div>
          </div>
        </div>
        
        <div class="card">
          <h2 class="card-title mb-3">🚀 Accesos Rápidos</h2>
          <div class="grid grid-cols-4 gap-2">
            <a href="#/admin/carritos" class="btn btn-primary">
              Gestionar Carritos
            </a>
            <a href="#/admin/paradas" class="btn btn-primary">
              Gestionar Paradas
            </a>
            <a href="#/admin/rutas" class="btn btn-primary">
              Gestionar Rutas
            </a>
            <a href="#/admin/horarios" class="btn btn-primary">
              Gestionar Horarios
            </a>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    closeLoading();
    console.error('Error cargando dashboard:', error);
    return `
      ${Navbar()}
      <div class="container">
        <div class="card text-center">
          <p style="color: #ef4444;">Error al cargar el dashboard</p>
        </div>
      </div>
    `;
  }
}

export function DashboardEvents() {
  // Eventos adicionales si es necesario
}