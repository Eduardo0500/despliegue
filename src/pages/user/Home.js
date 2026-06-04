import { Navbar } from '../../components/Navbar.js';
import { CarritoCard } from '../../components/CarritoCard.js';
import { getCarritos } from '../../services/carritos.js';
import { showLoading, closeLoading } from '../../utils/helpers.js';

export async function Home() {
  showLoading();
  
  try {
    const carritos = await getCarritos();
    const carritosActivos = carritos.filter(c => c.estado === 'activo');
    
    closeLoading();
    
    return `
      ${Navbar()}
      <div class="container fade-in">
        <div class="dashboard-header">
          <h1 class="dashboard-title">🚌 Carritos Disponibles</h1>
          <p class="dashboard-subtitle">Selecciona un carrito para ver su ruta y horarios</p>
        </div>
        
        ${carritosActivos.length === 0 ? `
          <div class="card text-center">
            <p style="color: #94a3b8;">No hay carritos disponibles en este momento</p>
          </div>
        ` : `
          <div class="grid grid-cols-3">
            ${carritosActivos.map(carrito => CarritoCard(carrito)).join('')}
          </div>
        `}
      </div>
    `;
  } catch (error) {
    closeLoading();
    console.error('Error cargando carritos:', error);
    return `
      ${Navbar()}
      <div class="container">
        <div class="card text-center">
          <p style="color: #ef4444;">Error al cargar los carritos</p>
        </div>
      </div>
    `;
  }
}

export function HomeEvents() {
  // Eventos adicionales si es necesario
}