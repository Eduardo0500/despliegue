import { Navbar } from '../../components/Navbar.js';
import { MapComponent } from '../../components/Map.js';
import { getRutas, createRuta, updateRuta, deleteRuta, addParadaToRuta, removeParadaFromRuta } from '../../services/rutas.js';
import { getParadas } from '../../services/paradas.js';
import { showAlert, showConfirm, showLoading, closeLoading } from '../../utils/helpers.js';

let rutaEdit = null;

export async function GestionRutas() {
  showLoading();
  
  try {
    const rutas = await getRutas();
    closeLoading();
    
    return `
      ${Navbar()}
      <div class="container fade-in">
        <div class="flex-between mb-3">
          <h1 class="dashboard-title">🛣️ Gestión de Rutas</h1>
          <button onclick="openRutaModal()" class="btn btn-primary">
            + Nueva Ruta
          </button>
        </div>
        
        ${rutas.length === 0 ? `
          <div class="card text-center">
            <p style="color: #94a3b8;">No hay rutas registradas</p>
          </div>
        ` : `
          <div class="grid grid-cols-1">
            ${rutas.map(ruta => `
              <div class="card">
                <div class="flex-between mb-2">
                  <h3 class="card-title">${ruta.nombre}</h3>
                  <div class="flex gap-1">
                    <button onclick="verRutaDetalle(${ruta.id})" class="btn btn-secondary btn-small">
                      Ver Mapa
                    </button>
                    <button onclick="editRuta(${ruta.id})" class="btn btn-secondary btn-small">
                      Editar
                    </button>
                    <button onclick="deleteRutaConfirm(${ruta.id})" class="btn btn-danger btn-small">
                      Eliminar
                    </button>
                  </div>
                </div>
                <p style="color: #94a3b8; margin-bottom: 1rem;">${ruta.descripcion || 'Sin descripción'}</p>
                <div class="flex gap-2" style="align-items: center;">
                  <span style="color: #cbd5e1;">Color:</span>
                  <div style="width: 30px; height: 30px; background: ${ruta.color}; border-radius: 0.25rem; border: 1px solid rgba(255,255,255,0.2);"></div>
                  <span style="color: #cbd5e1;">Paradas: ${ruta.ruta_paradas?.length || 0}</span>
                </div>
                ${ruta.ruta_paradas && ruta.ruta_paradas.length > 0 ? `
                  <div class="mt-2">
                    <strong style="color: #cbd5e1;">Recorrido:</strong>
                    <ol style="margin-top: 0.5rem; padding-left: 1.5rem; color: #94a3b8;">
                      ${ruta.ruta_paradas.map(rp => `
                        <li>${rp.paradas.nombre} (${rp.tiempo_estimado_minutos} min)</li>
                      `).join('')}
                    </ol>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        `}
        
        <!-- Modal Ruta -->
        <div id="rutaModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; justify-content: center; align-items: center; overflow-y: auto;">
          <div class="card" style="max-width: 500px; width: 90%; margin: 20px;">
            <h2 class="card-title mb-3" id="modalTitle">Nueva Ruta</h2>
            <form id="rutaForm">
              <div class="form-group">
                <label class="form-label">Nombre de la Ruta</label>
                <input type="text" id="nombre" class="form-input" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea id="descripcion" class="form-textarea" rows="2"></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">Color</label>
                <input type="color" id="color" class="form-input" value="#3b82f6" style="height: 50px;">
              </div>
              
              <div class="flex gap-2">
                <button type="submit" class="btn btn-primary" style="flex: 1;">
                  Guardar
                </button>
                <button type="button" onclick="closeRutaModal()" class="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Modal Ver Ruta -->
        <div id="rutaDetalleModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; justify-content: center; align-items: center;">
          <div class="card" style="max-width: 800px; width: 90%;">
            <div class="flex-between mb-3">
              <h2 class="card-title" id="rutaDetalleTitle"></h2>
              <button onclick="closeRutaDetalleModal()" class="btn btn-secondary btn-small">
                Cerrar
              </button>
            </div>
            <div class="map-container" id="mapRutaDetalle" style="height: 500px;"></div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    closeLoading();
    console.error('Error cargando rutas:', error);
    return `
      ${Navbar()}
      <div class="container">
        <div class="card text-center">
          <p style="color: #ef4444;">Error al cargar las rutas</p>
        </div>
      </div>
    `;
  }
}

export async function GestionRutasEvents() {
  const form = document.getElementById('rutaForm');
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
      nombre: document.getElementById('nombre').value,
      descripcion: document.getElementById('descripcion').value,
      color: document.getElementById('color').value
    };
    
    try {
      if (rutaEdit) {
        await updateRuta(rutaEdit, data);
        await showAlert('¡Actualizado!', 'Ruta actualizada exitosamente', 'success');
      } else {
        await createRuta(data);
        await showAlert('¡Creado!', 'Ruta creada exitosamente', 'success');
      }
      
      rutaEdit = null;
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Error', 'No se pudo guardar la ruta', 'error');
    }
  });
}

window.openRutaModal = () => {
  rutaEdit = null;
  document.getElementById('modalTitle').textContent = 'Nueva Ruta';
  document.getElementById('rutaForm').reset();
  document.getElementById('rutaModal').style.display = 'flex';
};

window.closeRutaModal = () => {
  document.getElementById('rutaModal').style.display = 'none';
};

window.editRuta = async (id) => {
  try {
    const { getRutaById } = await import('../../services/rutas.js');
    const ruta = await getRutaById(id);
    
    rutaEdit = id;
    document.getElementById('modalTitle').textContent = 'Editar Ruta';
    document.getElementById('nombre').value = ruta.nombre;
    document.getElementById('descripcion').value = ruta.descripcion || '';
    document.getElementById('color').value = ruta.color || '#3b82f6';
    document.getElementById('rutaModal').style.display = 'flex';
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error', 'No se pudo cargar la ruta', 'error');
  }
};

window.deleteRutaConfirm = async (id) => {
  const confirmed = await showConfirm(
    '¿Eliminar ruta?',
    'Esta acción eliminará también todas las paradas asociadas'
  );
  
  if (confirmed) {
    try {
      await deleteRuta(id);
      await showAlert('¡Eliminado!', 'Ruta eliminada exitosamente', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Error', 'No se pudo eliminar la ruta', 'error');
    }
  }
};

window.verRutaDetalle = async (id) => {
  try {
    const { getRutaById } = await import('../../services/rutas.js');
    const ruta = await getRutaById(id);
    
    document.getElementById('rutaDetalleTitle').textContent = ruta.nombre;
    document.getElementById('rutaDetalleModal').style.display = 'flex';
    
    setTimeout(() => {
      const mapDetalle = new MapComponent('mapRutaDetalle').init();
      
      if (ruta.ruta_paradas && ruta.ruta_paradas.length > 0) {
        const coordinates = [];
        
        ruta.ruta_paradas.forEach((rp, index) => {
          const parada = rp.paradas;
          const lat = parseFloat(parada.latitud);
          const lng = parseFloat(parada.longitud);
          coordinates.push([lat, lng]);
          
          mapDetalle.addMarker(
            lat,
            lng,
            `<strong>${index + 1}. ${parada.nombre}</strong><br>
             Tiempo: ${rp.tiempo_estimado_minutos} min`,
            'blue'
          );
        });
        
        if (coordinates.length > 1) {
          mapDetalle.addRoute(coordinates, ruta.color);
        }
      }
    }, 100);
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error', 'No se pudo cargar el detalle de la ruta', 'error');
  }
};

window.closeRutaDetalleModal = () => {
  document.getElementById('rutaDetalleModal').style.display = 'none';
};