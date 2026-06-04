import { Navbar } from '../../components/Navbar.js';
import { getCarritos, createCarrito, updateCarrito, deleteCarrito } from '../../services/carritos.js';
import { showAlert, showConfirm, showLoading, closeLoading } from '../../utils/helpers.js';

let carritoEdit = null;

export async function GestionCarritos() {
  showLoading();
  
  try {
    const carritos = await getCarritos();
    closeLoading();
    
    return `
      ${Navbar()}
      <div class="container fade-in">
        <div class="flex-between mb-3">
          <h1 class="dashboard-title">🚌 Gestión de Carritos</h1>
          <button onclick="openCarritoModal()" class="btn btn-primary">
            + Nuevo Carrito
          </button>
        </div>
        
        ${carritos.length === 0 ? `
          <div class="card text-center">
            <p style="color: #94a3b8;">No hay carritos registrados</p>
          </div>
        ` : `
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Capacidad</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${carritos.map(carrito => `
                  <tr>
                    <td><strong>#${carrito.numero}</strong></td>
                    <td>${carrito.capacidad} personas</td>
                    <td>
                      <span class="badge ${carrito.estado === 'activo' ? 'badge-success' : 'badge-danger'}">
                        ${carrito.estado}
                      </span>
                    </td>
                    <td>${carrito.descripcion || '-'}</td>
                    <td>
                      <div class="flex gap-1">
                        <button onclick="editCarrito(${carrito.id})" class="btn btn-secondary btn-small">
                          Editar
                        </button>
                        <button onclick="deleteCarritoConfirm(${carrito.id})" class="btn btn-danger btn-small">
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
        <div id="carritoModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; justify-content: center; align-items: center;">
          <div class="card" style="max-width: 500px; width: 90%;">
            <h2 class="card-title mb-3" id="modalTitle">Nuevo Carrito</h2>
            <form id="carritoForm">
              <div class="form-group">
                <label class="form-label">Número del Carrito</label>
                <input type="number" id="numero" class="form-input" required min="1">
              </div>
              
              <div class="form-group">
                <label class="form-label">Capacidad</label>
                <input type="number" id="capacidad" class="form-input" required min="1" value="20">
              </div>
              
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select id="estado" class="form-select">
                  <option value="activo">Activo</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Descripción (opcional)</label>
                <textarea id="descripcion" class="form-textarea" rows="3"></textarea>
              </div>
              
              <div class="flex gap-2">
                <button type="submit" class="btn btn-primary" style="flex: 1;">
                  Guardar
                </button>
                <button type="button" onclick="closeCarritoModal()" class="btn btn-secondary">
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

export async function GestionCarritosEvents() {
  const form = document.getElementById('carritoForm');
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
      numero: parseInt(document.getElementById('numero').value),
      capacidad: parseInt(document.getElementById('capacidad').value),
      estado: document.getElementById('estado').value,
      descripcion: document.getElementById('descripcion').value
    };
    
    try {
      if (carritoEdit) {
        await updateCarrito(carritoEdit, data);
        await showAlert('¡Actualizado!', 'Carrito actualizado exitosamente', 'success');
      } else {
        await createCarrito(data);
        await showAlert('¡Creado!', 'Carrito creado exitosamente', 'success');
      }
      
      carritoEdit = null;
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Error', 'No se pudo guardar el carrito', 'error');
    }
  });
}

// Funciones globales
window.openCarritoModal = () => {
  carritoEdit = null;
  document.getElementById('modalTitle').textContent = 'Nuevo Carrito';
  document.getElementById('carritoForm').reset();
  document.getElementById('carritoModal').style.display = 'flex';
};

window.closeCarritoModal = () => {
  document.getElementById('carritoModal').style.display = 'none';
};

window.editCarrito = async (id) => {
  try {
    const { getCarritoById } = await import('../../services/carritos.js');
    const carrito = await getCarritoById(id);
    
    carritoEdit = id;
    document.getElementById('modalTitle').textContent = 'Editar Carrito';
    document.getElementById('numero').value = carrito.numero;
    document.getElementById('capacidad').value = carrito.capacidad;
    document.getElementById('estado').value = carrito.estado;
    document.getElementById('descripcion').value = carrito.descripcion || '';
    document.getElementById('carritoModal').style.display = 'flex';
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error', 'No se pudo cargar el carrito', 'error');
  }
};

window.deleteCarritoConfirm = async (id) => {
  const confirmed = await showConfirm(
    '¿Eliminar carrito?',
    'Esta acción no se puede deshacer'
  );
  
  if (confirmed) {
    try {
      await deleteCarrito(id);
      await showAlert('¡Eliminado!', 'Carrito eliminado exitosamente', 'success');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      showAlert('Error', 'No se pudo eliminar el carrito', 'error');
    }
  }
};