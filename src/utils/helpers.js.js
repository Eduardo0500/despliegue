//Funciones auxiliares
import Swal from 'sweetalert2';

export const showAlert = (title, text, icon = 'info') => {
  return Swal.fire({
    title,
    text,
    icon,
    background: '#1e293b',
    color: '#f1f5f9',
    confirmButtonColor: '#3b82f6',
  });
};

export const showConfirm = async (title, text) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: '#1e293b',
    color: '#f1f5f9',
  });
  return result.isConfirmed;
};

export const showLoading = () => {
  Swal.fire({
    title: 'Cargando...',
    allowOutsideClick: false,
    background: '#1e293b',
    color: '#f1f5f9',
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoading = () => {
  Swal.close();
};

export const formatTime = (time) => {
  if (!time) return '';
  return time.substring(0, 5);
};

export const getDiasEspanol = (dias) => {
  const diasMap = {
    lunes: 'L',
    martes: 'M',
    miércoles: 'X',
    jueves: 'J',
    viernes: 'V',
    sábado: 'S',
    domingo: 'D',
  };
  return dias.map(d => diasMap[d.toLowerCase()] || d).join(', ');
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada'));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error)
    );
  });
};