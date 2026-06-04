import { Navbar } from '../../components/Navbar.js';
import { MapComponent } from '../../components/Map.js';
import { getParadas, createParada, updateParada, deleteParada } from '../../services/paradas.js';
import { showAlert, showConfirm, showLoading, closeLoading } from '../../utils/helpers.js';

let paradaEdit = null;
let mapSelector = null;
let selectedLocation = null;

export async function GestionParadas() {
  showLoading();
  
  try {
    const paradas = await getParadas();
    closeLoading();
    
    return `
      ${Navbar()}
      <div class="container fade-in">
        <div class="flex-between mb-3">
          <h1 class="dashboard-title">📍 Gestión de Paradas</h1>
          <button onclick="openParadaModal()" class="btn btn-primary">
            + Nueva Parada
          </button>
        </div>
        
        ${paradas.length === 0 ? `
          <div class="card text-center">
            <p style="color: #94a3b8;">No hay paradas registradas</p>
          </div>
        ` : `
          <div class="grid grid-cols-2">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Facultad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${paradas.map(parada => `
                    <tr>
                      <td><strong>${parada.nombre}</strong></td>
                      <td>${parada.facultad || '-'}</td>
                      <td>
                        <div class="flex gap-1">
                          <button onclick="editParada(${parada.id})" class="btn btn-secondary btn-small">
                            Editar
                          </button>
                          <button onclick="deleteParadaConfirm(${parada.id})" class="btn btn-danger btn-small">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <div>
              <h2 class="card-title mb-2">🗺️ Ubicación de Paradas</h2>
              <div class="map-container" id="mapParadas"></div>
            </div>
          </div>
        `}
        
        <!-- Modal -->
        <div id="paradaModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; justify-content: center; align-items: center; overflow-y: auto;">
          <div class="card" style="max-width: 600px; width: 90%; margin: 20px;">
            <h2 class="card-title mb-3" id="modalTitle">Nueva Parada</h2>
            <form id="paradaForm">
              <div class="form-group">
                <label class="form-label">Nombre de la Parada</label>
                <input type="text" id="nombre" class="form-input" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Facultad (opcional)</label>
                <input type="text" id="facultad" class="form-input" placeholder="Ej: Ingeniería">
              </div>
              
              <div class="form-group">
                <label class="form-label">Referencia (opcional)</label>
                <textarea id="referencia" class="form-textarea" rows="2" placeholder="Punto de referencia cercano"></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">Ubicación en el Mapa</label>
                <p style="color: #94a3b8; font-size: 0.875rem; margin-bottom: 0.5rem;">
                  Haz clic en el mapa para seleccionar la ubicación
                </p>
                <div class="map-container" id="mapSelector" style="height: 300px;"></div>
                <input type="hidden" id="latitud" required>
                <input type="hidden" id="longitud" required>
                <p id="coordsDisplay" style="color: #60a5fa; font-size: 0.875rem; margin-top: 0.5rem;"></p>
              </div>
              
              <div class="flex gap-2">
                <button type="submit" class="btn btn-primary" style="flex: 1;">
                  Guardar
                </button>
                <button type="button" onclick="closeParadaModal()" class="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    closeLoading();
    console.error('Error cargando paradas:', error);
    return `
      ${Navbar()}
      <div class="container">
        <div class="card text-center">
          <p style="color: #ef4444;">Error al cargar las paradas</p>
        </div>
      </div>
    `;
  }
}

export async function GestionParadasEvents() {
  // Mapa de visualización de paradas
  if (document.getElementById('mapParadas')) {
    const paradas = await getParadas();
    const mapParadas = new MapComponent('mapParadas').init();
    
    paradas.forEach(parada => {
      mapParadas.addMarker(
        parseFloat(parada.latitud),
        parseFloat(parada.longitud),
        `<strong>${parada.nombre}</strong><br>
         ${parada.facultad ? `Facultad: ${parada.facultad}<br>` : ''}
         ${parada.referencia || ''}`,
        'blue'
      );
    });
  }
  
  // Form submit
  const form = document.getElementById('paradaForm');
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const latitud = document.getElementById('latitud').value;
    const longitud = document.getElementById('longitud').value;
    
    if (!latitud || !longitud) {
      showAlert('Error', 'Debes seleccionar una ubicación en el mapa', 'warning');
      return;
    }
    
    const data = {
      nombre: document.getElementById('nombre').value,
      facultad: document.getElementById('facultad').value || null,
      referencia: document.getElementById('referencia').value || null,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud)
    };
    
    try {
      if (paradaEdit) {
        await updateParada(paradaEdit, data);
        await showAlert('¡Actualizado!', 'Parada actualizada exitosamente', 'success');
      } else {
        await createParada(data);
        await showAlert('¡Creado!', 'Parada creada exitosamente', 'success');
      }
      
      paradaEdit = null;
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Error', 'No se pudo guardar la parada', 'error');
    }
  });
}

window.openParadaModal = () => {
  paradaEdit = null;
  selectedLocation = null;
  document.getElementById('modalTitle').textContent = 'Nueva Parada';
  document.getElementById('paradaForm').reset();
  document.getElementById('latitud').value = '';
  document.getElementById('longitud').value = '';
  document.getElementById('coordsDisplay').textContent = '';
  document.getElementById('paradaModal').style.display = 'flex';
  
  setTimeout(() => {
    if (mapSelector) {
      mapSelector.destroy();
    }
    mapSelector = new MapComponent('mapSelector', [-0.9537, -80.7343], 15).init();
    
    mapSelector.map.on('click', (e) => {
      selectedLocation = e.latlng;
      document.getElementById('latitud').value = e.latlng.lat;
      document.getElementById('longitud').value = e.latlng.lng;
      document.getElementById('coordsDisplay').textContent = 
        `📍 Coordenadas: ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
      
      mapSelector.clearMarkers();
      mapSelector.addMarker(e.latlng.lat, e.latlng.lng, 'Ubicación seleccionada', 'red');
    });
  }, 100);
};

window.closeParadaModal = () => {
  document.getElementById('paradaModal').style.display = 'none';
  if (mapSelector) {
    mapSelector.destroy();
    mapSelector = null;
  }
};

window.editParada = async (id) => {
  try {
    const { getParadaById } = await import('../../services/paradas.js');
    const parada = await getParadaById(id);
    
    paradaEdit = id;
    document.getElementById('modalTitle').textContent = 'Editar Parada';
    document.getElementById('nombre').value = parada.nombre;
    document.getElementById('facultad').value = parada.facultad || '';
    document.getElementById('referencia').value = parada.referencia || '';
    document.getElementById('latitud').value = parada.latitud;
    document.getElementById('longitud').value = parada.longitud;
    document.getElementById('coordsDisplay').textContent = 
      `📍 Coordenadas: ${parada.latitud}, ${parada.longitud}`;
    document.getElementById('paradaModal').style.display = 'flex';
    
    setTimeout(() => {
      if (mapSelector) {
        mapSelector.destroy();
      }
      mapSelector = new MapComponent('mapSelector', 
        [parseFloat(parada.latitud), parseFloat(parada.longitud)], 16).init();
      
      mapSelector.addMarker(
        parseFloat(parada.latitud),
        parseFloat(parada.longitud),
        'Ubicación actual',
        'red'
      );
      
      mapSelector.map.on('click', (e) => {
        selectedLocation = e.latlng;
        document.getElementById('latitud').value = e.latlng.lat;
        document.getElementById('longitud').value = e.latlng.lng;
        document.getElementById('coordsDisplay').textContent = 
          `📍 Coordenadas: ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
        
        mapSelector.clearMarkers();
        mapSelector.addMarker(e.latlng.lat, e.latlng.lng, 'Nueva ubicación', 'red');
      });
    }, 100);
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error', 'No se pudo cargar la parada', 'error');
  }
};

window.deleteParadaConfirm = async (id) => {
  const confirmed = await showConfirm(
    '¿Eliminar parada?',
    'Esta acción no se puede deshacer'
  );
  
  if (confirmed) {
    try {
      await deleteParada(id);
      await showAlert('¡Eliminado!', 'Parada eliminada exitosamente', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Error', 'No se pudo eliminar la parada', 'error');
    }
  }
};