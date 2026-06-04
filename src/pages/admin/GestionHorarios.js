import { Navbar } from '../../components/Navbar.js';
import { getHorarios, createHorario, updateHorario, deleteHorario } from '../../services/horarios.js';
import { getCarritos } from '../../services/carritos.js';
import { getRutas } from '../../services/rutas.js';
import { showAlert, showConfirm, showLoading, closeLoading, formatTime, getDiasEspanol } from '../../utils/helpers.js';

let horarioEdit = null;

export async function GestionHorarios() {
  showLoading();
  
  try {
    const [horarios, carritos, rutas] = await Promise.all([
      getHorarios(),
      getCarritos(),
      getRutas()
    ]);
    
    closeLoading();
    
    return `
      ${Navbar()}
      <div class="container fade-in">
        <div class="flex-between mb-3">
          <h1 class="dashboard-title">⏰ Gestión de Horarios</h1>
          <button onclick="openHorarioModal()" class="btn btn-primary">
            + Nuevo Horario
          </button>
        </div>
        
        ${horarios.length === 0 ? `
          <div class="card text-center">
            <p style="color: #94a3b8;">No hay horarios registrados</p>
          </div>
        ` : `
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Carrito</th>
                  <th>Ruta</th>
                  <th>Días</th>
                  <th>Horario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${horarios.map(horario => `
                  <tr>
                    <td>
                      <span class="badge badge-info">Carrito #${horario.carritos.numero}</span>
                    </td>
                    <td>${horario.rutas?.nombre || 'Sin ruta'}</td>
                    <td>${getDiasEspanol(horario.dias_semana)}</td>
                    <td>${formatTime(horario.hora_inicio)} - ${formatTime(horario.hora_fin)}</td>
                    <td>
                      <div class="flex gap-1">
                        <button onclick="editHorario(${horario.id})" class="btn btn-secondary btn-small">
                          Editar
                        </button>
                        <button onclick="deleteHorarioConfirm(${horario.id})" class="btn btn-danger btn-small">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
        
        <!-- Modal -->
        <div id="horarioModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; justify-content: center; align-items: center; overflow-y: auto;">
          <div class="card" style="max-width: 500px; width: 90%; margin: 20px;">
            <h2 class="card-title mb-3" id="modalTitle">Nuevo Horario</h2>
            <form id="horarioForm">
              <div class="form-group">
                <label class="form-label">Carrito</label>
                <select id="carrito_id" class="form-select" required>
                  <option value="">Seleccionar carrito</option>
                  ${carritos.map(c => `
                    <option value="${c.id}">Carrito #${c.numero}</option>
                  `).join('')}
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Ruta</label>
                <select id="ruta_id" class="form-select" required>
                  <option value="">Seleccionar ruta</option>
                  ${rutas.map(r => `
                    <option value="${r.id}">${r.nombre}</option>
                  `).join('')}
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Días de la Semana</label>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                  <label style="display: flex; align-items: center; gap: 0.5rem; color: #cbd5e1;">
                    <input type="checkbox" value="lunes" class="dia-checkbox"> Lunes
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem; color: #cbd5e1;">
                    <input type="checkbox" value="martes" class="dia-checkbox"> Martes
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem; color: #cbd5e1;">
                    <input type="checkbox" value="miércoles" class="dia-checkbox"> Miércoles
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem; color: #cbd5e1;">
                    <input type="checkbox" value="jueves" class="dia-checkbox"> Jueves
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem; color: #cbd5e1;">
                    <input type="checkbox" value="viernes" class="dia-checkbox"> Viernes
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem; color: #cbd5e1;">
                    <input type="checkbox" value="sábado" class="dia-checkbox"> Sábado
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Hora de Inicio</label>
                <input type="time" id="hora_inicio" class="form-input" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Hora de Fin</label>
                <input type="time" id="hora_fin" class="form-input" required>
              </div>
              
              <div class="flex gap-2">
                <button type="submit" class="btn btn-primary" style="flex: 1;">
                  Guardar
                </button>
                <button type="button" onclick="closeHorarioModal()" class="btn btn-secondary">
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
    console.error('Error cargando horarios:', error);
    return `
      ${Navbar()}
      <div class="container">
        <div class="card text-center">
          <p style="color: #ef4444;">Error al cargar los horarios</p>
        </div>
      </div>
    `;
  }
}

export async function GestionHorariosEvents() {
  const form = document.getElementById('horarioForm');
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const diasCheckboxes = document.querySelectorAll('.dia-checkbox:checked');
    const dias = Array.from(diasCheckboxes).map(cb => cb.value);
    
    if (dias.length === 0) {
      showAlert('Error', 'Debes seleccionar al menos un día', 'warning');
      return;
    }
    
    const data = {
      carrito_id: parseInt(document.getElementById('carrito_id').value),
      ruta_id: parseInt(document.getElementById('ruta_id').value),
      dias_semana: dias,
      hora_inicio: document.getElementById('hora_inicio').value,
      hora_fin: document.getElementById('hora_fin').value};
    
    try {
      if (horarioEdit) {
        await updateHorario(horarioEdit, data);
        await showAlert('¡Actualizado!', 'Horario actualizado exitosamente', 'success');
      } else {
        await createHorario(data);
        await showAlert('¡Creado!', 'Horario creado exitosamente', 'success');
      }
      
      horarioEdit = null;
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Error', 'No se pudo guardar el horario', 'error');
    }
  });
}

window.openHorarioModal = () => {
  horarioEdit = null;
  document.getElementById('modalTitle').textContent = 'Nuevo Horario';
  document.getElementById('horarioForm').reset();
  document.querySelectorAll('.dia-checkbox').forEach(cb => cb.checked = false);
  document.getElementById('horarioModal').style.display = 'flex';
};

window.closeHorarioModal = () => {
  document.getElementById('horarioModal').style.display = 'none';
};

window.editHorario = async (id) => {
  try {
    const horarios = await getHorarios();
    const horario = horarios.find(h => h.id === id);
    
    if (!horario) {
      throw new Error('Horario no encontrado');
    }
    
    horarioEdit = id;
    document.getElementById('modalTitle').textContent = 'Editar Horario';
    document.getElementById('carrito_id').value = horario.carrito_id;
    document.getElementById('ruta_id').value = horario.ruta_id;
    document.getElementById('hora_inicio').value = horario.hora_inicio;
    document.getElementById('hora_fin').value = horario.hora_fin;
    
    document.querySelectorAll('.dia-checkbox').forEach(cb => {
      cb.checked = horario.dias_semana.includes(cb.value);
    });
    
    document.getElementById('horarioModal').style.display = 'flex';
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error', 'No se pudo cargar el horario', 'error');
  }
};

window.deleteHorarioConfirm = async (id) => {
  const confirmed = await showConfirm(
    '¿Eliminar horario?',
    'Esta acción no se puede deshacer'
  );
  
  if (confirmed) {
    try {
      await deleteHorario(id);
      await showAlert('¡Eliminado!', 'Horario eliminado exitosamente', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Error', 'No se pudo eliminar el horario', 'error');
    }
  }
};