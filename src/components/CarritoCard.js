export function CarritoCard(carrito) {
  return `
    <div class="card fade-in">
      <div class="flex-between mb-2">
        <h3 class="card-title">Carrito #${carrito.numero}</h3>
        <span class="badge ${carrito.estado === 'activo' ? 'badge-success' : 'badge-danger'}">
          ${carrito.estado}
        </span>
      </div>
      <p class="card-subtitle">
        Capacidad: ${carrito.capacidad} personas
      </p>
      ${carrito.descripcion ? `
        <p style="color: #cbd5e1; margin-bottom: 1rem;">${carrito.descripcion}</p>
      ` : ''}
      <div class="flex gap-2">
        <a href="#/carrito/${carrito.id}" class="btn btn-primary btn-small" style="flex: 1;">
          Ver Detalles
        </a>
      </div>
    </div>
  `;
}