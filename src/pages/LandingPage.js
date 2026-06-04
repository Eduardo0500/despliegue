import { Logo } from '../components/Logo.js';
import { toggleTheme, getCurrentTheme } from '../utils/theme.js';

export function LandingPage() {
  const currentTheme = getCurrentTheme();
  
  return `
    <!-- Navegación Superior Fija -->
    <nav class="landing-nav">
      <div class="landing-nav-content">
        <a href="#/" class="nav-logo">
          ${Logo({ size: 'small' })}
        </a>
        
        <div class="nav-links">
          <button 
            id="themeToggle" 
            class="theme-toggle" 
            onclick="toggleTheme()"
            title="Cambiar tema"
          >
            ${currentTheme === 'dark' ? '☀️' : '🌙'}
          </button>
          <a href="#como-funciona" class="nav-link">Cómo Funciona</a>
          <a href="#contacto" class="nav-link">Contacto</a>
          <a href="#/login" class="btn btn-primary btn-small">Iniciar Sesión</a>
        </div>
      </div>
    </nav>

    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content fade-in">
          <div class="hero-icon">🚌</div>
          <h1 class="hero-title">
            Sistema de Carritos
            <span class="gradient-text">ULEAM</span>
          </h1>
          <p class="hero-subtitle">
            Conoce en tiempo real dónde están los carritos,
            sus rutas y horarios. Nunca más pierdas el transporte.
          </p>
          <div class="hero-buttons">
            <a href="#/login" class="btn btn-primary btn-large">
              Comenzar Ahora
            </a>
            <a href="#como-funciona" class="btn btn-secondary btn-large">
              Conocer Más
            </a>
          </div>
        </div>
        
        <!-- Animated Background -->
        <div class="hero-decoration">
          <div class="floating-bus">🚌</div>
          <div class="floating-pin">📍</div>
          <div class="floating-clock">⏰</div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section" id="como-funciona">
        <div class="container">
          <h2 class="section-title">¿Cómo funciona?</h2>
          <p class="section-subtitle">
            Tres pasos simples para nunca perder el carrito
          </p>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3 class="feature-title">1. Regístrate</h3>
              <p class="feature-description">
                Crea tu cuenta con tu correo institucional ULEAM en menos de 1 minuto.
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🗺️</div>
              <h3 class="feature-title">2. Consulta Rutas</h3>
              <p class="feature-description">
                Ve en tiempo real dónde están los carritos y cuándo llegarán a tu parada.
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">⏱️</div>
              <h3 class="feature-title">3. Planifica</h3>
              <p class="feature-description">
                Revisa horarios, rutas y paradas para optimizar tu tiempo en el campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="benefits-section">
        <div class="container">
          <div class="benefits-content">
            <div class="benefits-text">
              <h2 class="section-title">Beneficios del Sistema</h2>
              <ul class="benefits-list">
                <li class="benefit-item">
                  <span class="benefit-icon">✅</span>
                  <div>
                    <strong>Ubicación en Tiempo Real</strong>
                    <p>Sabe exactamente dónde está cada carrito en cada momento</p>
                  </div>
                </li>
                <li class="benefit-item">
                  <span class="benefit-icon">✅</span>
                  <div>
                    <strong>Horarios Actualizados</strong>
                    <p>Consulta los horarios de operación de cada ruta</p>
                  </div>
                </li>
                <li class="benefit-item">
                  <span class="benefit-icon">✅</span>
                  <div>
                    <strong>Mapas Interactivos</strong>
                    <p>Visualiza todas las paradas y rutas en el campus</p>
                  </div>
                </li>
                <li class="benefit-item">
                  <span class="benefit-icon">✅</span>
                  <div>
                    <strong>Ahorra Tiempo</strong>
                    <p>Planifica tu día y llega puntual a tus clases</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="benefits-visual">
              <div class="visual-card">
                <div class="visual-stat">
                  <div class="stat-number">5+</div>
                  <div class="stat-label">Rutas Disponibles</div>
                </div>
                <div class="visual-stat">
                  <div class="stat-number">20+</div>
                  <div class="stat-label">Paradas en Campus</div>
                </div>
                <div class="visual-stat">
                  <div class="stat-number">24/7</div>
                  <div class="stat-label">Acceso al Sistema</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-title">¿Listo para optimizar tu transporte en ULEAM?</h2>
            <p class="cta-subtitle">
              Únete a cientos de estudiantes que ya usan el sistema
            </p>
            <a href="#/login" class="btn btn-primary btn-large">
              Crear Cuenta Gratis
            </a>
          </div>
        </div>
      </section>

      <!-- Footer / Contacto -->
      <footer class="landing-footer" id="contacto">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              ${Logo({ size: 'medium' })}
              <p style="margin-top: 1rem; color: var(--text-tertiary); max-width: 300px;">
                Sistema de transporte universitario inteligente para la comunidad ULEAM.
              </p>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">Contacto</h3>
              <ul class="footer-list">
                <li>📧 info@uleam.edu.ec</li>
                <li>📞 (05) 2623-740</li>
                <li>📍 Manta, Manabí, Ecuador</li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">Enlaces</h3>
              <ul class="footer-list">
                <li><a href="#/login">Iniciar Sesión</a></li>
                <li><a href="#como-funciona">Cómo Funciona</a></li>
                <li><a href="https://www.uleam.edu.ec" target="_blank">Sitio Web ULEAM</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">Soporte</h3>
              <ul class="footer-list">
                <li><a href="#" onclick="alert('Próximamente: Centro de ayuda')">Centro de Ayuda</a></li>
                <li><a href="#" onclick="alert('Próximamente: Preguntas frecuentes')">Preguntas Frecuentes</a></li>
                <li><a href="#" onclick="alert('Email: soporte@uleam.edu.ec')">Reportar Problema</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>© 2024 Sistema de Carritos ULEAM. Todos los derechos reservados.</p>
            <p style="font-size: 0.75rem; margin-top: 0.5rem;">
              Desarrollado para la comunidad estudiantil de la Universidad Laica Eloy Alfaro de Manabí
            </p>
          </div>
        </div>
      </footer>
    </div>
  `;
}

export function LandingPageEvents() {
  // Smooth scroll para los enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Si es una ruta del router (como #/login), no hacer scroll
      if (href.startsWith('#/')) {
        return;
      }
      
      // Si es un ancla interna (como #como-funciona)
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = document.querySelector('.landing-nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Animación al hacer scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .benefit-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
  
  // Cambiar estilo de navbar al hacer scroll
  const nav = document.querySelector('.landing-nav');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// Función global para toggle de tema
window.toggleTheme = toggleTheme;