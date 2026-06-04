import L from 'leaflet';

export class MapComponent {
  constructor(containerId, center = [-0.9537, -80.7343], zoom = 15) {
    this.containerId = containerId;
    this.center = center;
    this.zoom = zoom;
    this.map = null;
    this.markers = [];
  }

  init() {
    // Crear el mapa
    this.map = L.map(this.containerId).setView(this.center, this.zoom);

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    return this;
  }

  addMarker(lat, lng, popupText, iconColor = 'blue') {
    const marker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }).addTo(this.map);

    if (popupText) {
      marker.bindPopup(popupText);
    }

    this.markers.push(marker);
    return marker;
  }

  addRoute(coordinates, color = '#3b82f6') {
    const polyline = L.polyline(coordinates, {
      color: color,
      weight: 4,
      opacity: 0.7
    }).addTo(this.map);

    // Ajustar vista para mostrar toda la ruta
    this.map.fitBounds(polyline.getBounds());

    return polyline;
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  setView(lat, lng, zoom = this.zoom) {
    this.map.setView([lat, lng], zoom);
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}