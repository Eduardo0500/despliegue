import { formatTime, getDiasEspanol } from '../utils/helpers.js';

export function HorarioTable(horarios) {
  if (!horarios || horarios.length === 0) {
    return `
      <div class="card">
        <p class="text-center" style="color: #94a3b8;">No hay horarios registrados</p>
      </div>
    `;
  }

  return `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Ruta</th>
            <th>Días</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
          </tr>
        </thead>
        <tbody>
          ${horarios.map(horario => `
            <tr>
              <td>
                <span class="badge badge-info">${horario.rutas?.nombre || 'Sin ruta'}</span>
              </td>
              <td>${getDiasEspanol(horario.dias_semana)}</td>
              <td>${formatTime(horario.hora_inicio)}</td>
              <td>${formatTime(horario.hora_fin)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}