import { Navbar } from '../../components/Navbar.js';
import { HorarioTable } from '../../components/HorarioTable.js';
import { MapComponent } from '../../components/Map.js';
import { getCarritoById } from '../../services/carritos.js';
import { getHorariosByCarrito, getPosicionCarrito } from '../../services/horarios.js';
import { getRutas } from '../../services/rutas.js';
import { showLoading, closeLoading } from '../../utils/helpers.js';

let map = null;

export async function DetalleCarrito(id) {
  showLoading();
  
  try {
    const [carrito, horarios, rutas, posicion] = await Promise.all([
      getCarritoById(id),
      getHorariosByCarrito(id),
      getRutas(),
      getPosicionCarrito(id)
    ]);
    
    closeLoading();
    
    return `
      ${Navbar()}
      <div class="container fade-in">
        <a href="#/home" class="btn btn-secondary mb-3">← Volver</a>
        
        <!-- Información del Carrito -->
        <div class="card mb-3">
          <div class="flex-between mb-2">
            <div>
              <h1 class="dashboard-title" style="margin-bottom: 0.5rem;">🚌 Carrito #${carrito.numero}</h1>
              <p style="color: var(--text-secondary);">
                Capacidad: ${carrito.capacidad} personas
              </p>
            </div>
            <span class="badge ${carrito.estado === 'activo' ? 'badge-success' : 'badge-danger'}" style="font-size: 1rem; padding: 0.5rem 1rem;">
              ${carrito.estado === 'activo' ? '✓ Operando' : '⚠ Mantenimiento'}
            </span>
          </div>
          ${carrito.descripcion ? `
            <p style="color: var(--text-tertiary); margin-top: 0.5rem;">
              ${carrito.descripcion}
            </p>
          ` : ''}
        </div>
        
        <!-- Grid principal -->
        <div class="grid grid-cols-1 mb-3" style="gap: 2rem;">
          
          <!-- SECCIÓN: Ruta y Facultades -->
          ${horarios.length > 0 && horarios[0].rutas ? `
            <div class="card">
              <h2 class="card-title mb-3">
                🗺️ ${horarios[0].rutas.nombre}
              </h2>
              <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                ${horarios[0].rutas.descripcion || 'Recorrido por el campus universitario'}
              </p>
              
              <!-- Mapa Grande del Campus -->
              <div style="height: 500px; border-radius: 1rem; overflow: hidden; margin-bottom: 2rem; border: 2px solid var(--border-color);">
                <div id="mapRuta" style="height: 100%; width: 100%;"></div>
              </div>
              
              <!-- Lista de Paradas con Referencias -->
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-primary);">
                  📍 Paradas del Recorrido
                </h3>
                <div id="paradaList" style="display: flex; flex-direction: column; gap: 1rem;">
                  <!-- Se llenará dinámicamente -->
                </div>
              </div>
            </div>
          ` : `
            <div class="card text-center">
              <p style="color: var(--text-tertiary);">Este carrito no tiene una ruta asignada</p>
            </div>
          `}
          
          <!-- SECCIÓN: Horarios -->
          <div class="card">
            <h2 class="card-title mb-3">⏰ Horarios de Operación</h2>
            ${HorarioTable(horarios)}
            
            ${horarios.length > 0 ? `
              <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
                <p style="color: var(--text-secondary); font-size: 0.95rem;">
                  <strong style="color: #60a5fa;">💡 Consejo:</strong> 
                  El carrito opera de ${horarios[0].hora_inicio.substring(0,5)} a ${horarios[0].hora_fin.substring(0,5)}. 
                  Llega a tu parada unos minutos antes para no perderlo.
                </p>
              </div>
            ` : ''}
          </div>
          
          <!-- SECCIÓN: Ubicación Actual -->
          <div class="card">
            <h2 class="card-title mb-3">📍 Ubicación Actual del Carrito</h2>
            
            <div style="height: 400px; border-radius: 1rem; overflow: hidden; border: 2px solid var(--border-color); margin-bottom: 1rem;">
              <div id="mapUbicacion" style="height: 100%; width: 100%;"></div>
            </div>
            
            ${posicion ? `
              <div style="padding: 1rem; background: rgba(16, 185, 129, 0.1); border-radius: 0.5rem; border-left: 4px solid #10b981;">
                <p style="color: var(--text-secondary);">
                  <strong style="color: #34d399;">✓ Carrito en operación</strong><br>
                  <span style="font-size: 0.875rem;">Última actualización: Hace pocos minutos</span>
                </p>
              </div>
            ` : `
              <div style="padding: 1rem; background: rgba(245, 158, 11, 0.1); border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
                <p style="color: var(--text-secondary);">
                  <strong style="color: #fbbf24;">⚠ Ubicación no disponible</strong><br>
                  <span style="font-size: 0.875rem;">El carrito podría estar fuera de operación o sin señal GPS</span>
                </p>
              </div>
            `}
          </div>
          
        </div>
        
        <!-- Información adicional -->
        <div class="card" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05));">
          <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-primary);">
            ℹ️ Información Importante
          </h3>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem;">
            <li style="display: flex; gap: 0.75rem; color: var(--text-secondary);">
              <span>•</span>
              <span>El carrito puede adelantarse o retrasarse hasta 5 minutos según el tráfico</span>
            </li>
            <li style="display: flex; gap: 0.75rem; color: var(--text-secondary);">
              <span>•</span>
              <span>Espera en la parada indicada con anticipación</span>
            </li>
            <li style="display: flex; gap: 0.75rem; color: var(--text-secondary);">
              <span>•</span>
              <span>Respeta la capacidad máxima del vehículo (${carrito.capacidad} personas)</span>
            </li>
            <li style="display: flex; gap: 0.75rem; color: var(--text-secondary);">
              <span>•</span>
              <span>Si el carrito está lleno, espera el siguiente en la misma ruta</span>
            </li>
          </ul>
        </div>
        
      </div>
    `;
  } catch (error) {
    closeLoading();
    console.error('Error cargando detalle:', error);
    return `
      ${Navbar()}
      <div class="container">
        <div class="card text-center">
          <p style="color: #ef4444;">Error al cargar los detalles del carrito</p>
          <a href="#/home" class="btn btn-primary mt-2">Volver al inicio</a>
        </div>
      </div>
    `;
  }
}

export async function DetalleCarritoEvents(id) {
  try {
    const [carrito, horarios, posicion] = await Promise.all([
      getCarritoById(id),
      getHorariosByCarrito(id),
      getPosicionCarrito(id)
    ]);
    
    // ============================================
    // MAPA DE UBICACIÓN ACTUAL
    // ============================================
    if (document.getElementById('mapUbicacion')) {
      // Centro del campus ULEAM en Manta
      const campusCenter = [-0.9537, -80.7343];
      const mapUbicacion = new MapComponent('mapUbicacion', campusCenter, 16).init();
      
      if (posicion) {
        mapUbicacion.addMarker(
          parseFloat(posicion.latitud),
          parseFloat(posicion.longitud),
          `<div style="text-align: center;">
            <strong style="font-size: 1.1rem;">🚌 Carrito #${carrito.numero}</strong><br>
            <span style="font-size: 0.9rem; color: #10b981;">● En operación</span>
          </div>`,
          'red'
        );
      } else {
        // Mostrar centro del campus si no hay posición
        mapUbicacion.addMarker(
          campusCenter[0],
          campusCenter[1],
          '<strong>Campus ULEAM</strong><br>Universidad Laica Eloy Alfaro de Manabí',
          'blue'
        );
      }
    }
    
    // ============================================
    // MAPA DE RUTA CON PARADAS
    // ============================================
    if (document.getElementById('mapRuta') && horarios.length > 0) {
      const rutaId = horarios[0].ruta_id;
      const rutas = await getRutas();
      const ruta = rutas.find(r => r.id === rutaId);
      
      if (ruta && ruta.ruta_paradas) {
        // Centro del campus ULEAM
        const mapRuta = new MapComponent('mapRuta', [-0.9537, -80.7343], 15).init();
        
        const coordinates = [];
        const paradasHTML = [];
        
        ruta.ruta_paradas.forEach((rp, index) => {
          const parada = rp.paradas;
          if (parada) {
            const lat = parseFloat(parada.latitud);
            const lng = parseFloat(parada.longitud);
            coordinates.push([lat, lng]);
            
            // Crear marcador en el mapa
            const markerColor = index === 0 ? 'green' : (index === ruta.ruta_paradas.length - 1 ? 'red' : 'blue');
            mapRuta.addMarker(
              lat,
              lng,
              `<div style="text-align: center; min-width: 200px;">
                <strong style="font-size: 1.1rem;">${index + 1}. ${parada.nombre}</strong><br>
                ${parada.facultad ? `<span style="color: #60a5fa;">📚 ${parada.facultad}</span><br>` : ''}
                ${parada.referencia ? `<span style="color: #94a3b8; font-size: 0.9rem;">📍 ${parada.referencia}</span><br>` : ''}
                <span style="color: #10b981; font-size: 0.85rem;">⏱ ${rp.tiempo_estimado_minutos} min desde anterior</span>
              </div>`,
              markerColor
            );
            
            // Crear card de parada
            paradasHTML.push(`
              <div class="parada-card" style="
                background: var(--bg-secondary);
                border: 2px solid var(--border-color);
                border-radius: 0.75rem;
                padding: 1.25rem;
                transition: all 0.3s;
                cursor: pointer;
              " onmouseover="this.style.borderColor='#3b82f6'; this.style.transform='translateX(5px)'" onmouseout="this.style.borderColor='var(--border-color)'; this.style.transform='translateX(0)'">
                <div style="display: flex; align-items: start; gap: 1rem;">
                  <div style="
                    background: ${index === 0 ? '#10b981' : (index === ruta.ruta_paradas.length - 1 ? '#ef4444' : '#3b82f6')};
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.1rem;
                    flex-shrink: 0;
                  ">
                    ${index + 1}
                  </div>
                  
                  <div style="flex: 1;">
                    <h4 style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">
                      ${parada.nombre}
                      ${index === 0 ? '<span style="color: #10b981; font-size: 0.85rem; margin-left: 0.5rem;">● Inicio</span>' : ''}
                      ${index === ruta.ruta_paradas.length - 1 ? '<span style="color: #ef4444; font-size: 0.85rem; margin-left: 0.5rem;">● Final</span>' : ''}
                    </h4>
                    
                    ${parada.facultad ? `
                      <p style="color: #60a5fa; font-size: 0.95rem; margin-bottom: 0.25rem;">
                        📚 <strong>${parada.facultad}</strong>
                      </p>
                    ` : ''}
                    
                    ${parada.referencia ? `
                      <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;">
                        📍 ${parada.referencia}
                      </p>
                    ` : ''}
                    
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.75rem;">
                      ${index > 0 ? `
                        <span style="
                          display: inline-flex;
                          align-items: center;
                          gap: 0.25rem;
                          padding: 0.25rem 0.75rem;
                          background: rgba(16, 185, 129, 0.1);
                          color: #34d399;
                          border-radius: 9999px;
                          font-size: 0.85rem;
                          font-weight: 500;
                        ">
                          ⏱ ~${rp.tiempo_estimado_minutos} min desde parada anterior
                        </span>
                      ` : ''}
                      
                      <button onclick="centrarMapa(${lat}, ${lng})" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 0.25rem;
                        padding: 0.25rem 0.75rem;
                        background: rgba(59, 130, 246, 0.1);
                        color: #60a5fa;
                        border: none;
                        border-radius: 9999px;
                        font-size: 0.85rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s;
                      " onmouseover="this.style.background='rgba(59, 130, 246, 0.2)'" onmouseout="this.style.background='rgba(59, 130, 246, 0.1)'">
                        🗺️ Ver en mapa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `);
          }
        });
        
        // Insertar paradas en el DOM
        const paradaList = document.getElementById('paradaList');
        if (paradaList) {
          paradaList.innerHTML = paradasHTML.join('');
        }
        
        // Dibujar la ruta en el mapa
        if (coordinates.length > 1) {
          mapRuta.addRoute(coordinates, ruta.color || '#3b82f6');
        }
        
        // Función global para centrar el mapa
        window.centrarMapa = (lat, lng) => {
          mapRuta.setView(lat, lng, 18);
        };
      }
    }
    
  } catch (error) {
    console.error('Error en eventos:', error);
  }
}