export function Logo({ size = 'medium' }) {
  const sizes = {
    small: { width: '40px', fontSize: '1rem' },
    medium: { width: '60px', fontSize: '1.25rem' },
    large: { width: '80px', fontSize: '1.5rem' }
  };
  
  const currentSize = sizes[size] || sizes.medium;
  
  return `
    <div class="logo-container" style="display: flex; align-items: center; gap: 0.75rem;">
      <div class="logo-icon" style="position: relative; width: ${currentSize.width};">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <!-- Carrito de golf ULEAM -->
          <!-- Techo -->
          <path d="M 15 25 L 85 25 L 80 35 L 20 35 Z" fill="#3b82f6" stroke="#2563eb" stroke-width="2"/>
          
          <!-- Cuerpo principal -->
          <rect x="20" y="35" width="60" height="30" fill="#60a5fa" stroke="#3b82f6" stroke-width="2" rx="3"/>
          
          <!-- Ventanas -->
          <rect x="25" y="40" width="22" height="18" fill="#dbeafe" opacity="0.7" rx="2"/>
          <rect x="53" y="40" width="22" height="18" fill="#dbeafe" opacity="0.7" rx="2"/>
          
          <!-- Base -->
          <rect x="18" y="65" width="64" height="8" fill="#1e40af" stroke="#1e3a8a" stroke-width="2" rx="2"/>
          
          <!-- Ruedas -->
          <circle cx="30" cy="78" r="8" fill="#1f2937" stroke="#111827" stroke-width="2"/>
          <circle cx="30" cy="78" r="4" fill="#6b7280"/>
          
          <circle cx="70" cy="78" r="8" fill="#1f2937" stroke="#111827" stroke-width="2"/>
          <circle cx="70" cy="78" r="4" fill="#6b7280"/>
          
          <!-- Detalles ULEAM -->
          <text x="50" y="52" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">U</text>
        </svg>
      </div>
      <div class="logo-text" style="display: flex; flex-direction: column; line-height: 1.2;">
        <span style="font-size: ${currentSize.fontSize}; font-weight: 700; color: var(--text-primary);">Carritos ULEAM</span>
        ${size === 'large' ? '<span style="font-size: 0.75rem; color: var(--text-tertiary);">Sistema de Transporte</span>' : ''}
      </div>
    </div>
  `;
}