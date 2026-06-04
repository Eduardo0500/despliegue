import { login } from '../services/auth.js';
import { supabase } from '../config/supabase.js';
import { showAlert } from '../utils/helpers.js';
import { toggleTheme, getCurrentTheme } from '../utils/theme.js';
import { Logo } from '../components/Logo.js';

export function Login() {
  const currentTheme = getCurrentTheme();
  
  return `
    <!-- Navegación Superior -->
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
          <a href="#/" class="nav-link">Inicio</a>
          <a href="#/login" class="nav-link active">Iniciar Sesión</a>
        </div>
      </div>
    </nav>
    
    <div class="login-container">
      <div class="login-card">
        <div class="text-center mb-4">
          ${Logo({ size: 'large' })}
        </div>
        
        <!-- Tabs -->
        <div class="auth-tabs mb-3">
          <button class="auth-tab active" id="loginTab" onclick="switchToLogin()">
            Iniciar Sesión
          </button>
          <button class="auth-tab" id="registerTab" onclick="switchToRegister()">
            Crear Cuenta
          </button>
        </div>
        
        <!-- Login Form -->
        <form id="loginForm" style="display: block;">
          <div class="form-group">
            <label class="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              id="loginEmail" 
              class="form-input" 
              placeholder="ejemplo@uleam.edu.ec"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <div style="position: relative;">
              <input 
                type="password" 
                id="loginPassword" 
                class="form-input" 
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                class="password-toggle" 
                onclick="togglePassword('loginPassword')"
                title="Mostrar/Ocultar contraseña"
              >
                👁️
              </button>
            </div>
          </div>
          
          <div class="flex-between mb-3" style="font-size: 0.875rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); cursor: pointer;">
              <input type="checkbox" id="rememberMe"> Recordarme
            </label>
            <a href="#" onclick="showRecoverPassword()" style="color: #60a5fa; text-decoration: none;">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
            Ingresar
          </button>
          
          <div style="text-align: center; color: var(--text-tertiary); font-size: 0.875rem;">
            ¿No tienes cuenta? 
            <a href="#" onclick="switchToRegister()" style="color: #60a5fa; text-decoration: none;">
              Regístrate aquí
            </a>
          </div>
        </form>
        
        <!-- Register Form -->
        <form id="registerForm" style="display: none;">
          <div class="form-group">
            <label class="form-label">Nombre Completo</label>
            <input 
              type="text" 
              id="registerName" 
              class="form-input" 
              placeholder="Juan Pérez"
              required
              minlength="3"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Correo Institucional ULEAM</label>
            <input 
              type="email" 
              id="registerEmail" 
              class="form-input" 
              placeholder="ejemplo@uleam.edu.ec"
              pattern="[a-z0-9._%+-]+@uleam\\.edu\\.ec$"
              title="Debe ser un correo @uleam.edu.ec"
              required
            />
            <small style="color: var(--text-tertiary); font-size: 0.75rem;">Usa tu correo institucional</small>
          </div>
          
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <div style="position: relative;">
              <input 
                type="password" 
                id="registerPassword" 
                class="form-input" 
                placeholder="Mínimo 8 caracteres"
                required
                minlength="8"
              />
              <button 
                type="button" 
                class="password-toggle" 
                onclick="togglePassword('registerPassword')"
              >
                👁️
              </button>
            </div>
            <div id="passwordStrength" class="password-strength mt-1"></div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Confirmar Contraseña</label>
            <div style="position: relative;">
              <input 
                type="password" 
                id="registerPasswordConfirm" 
                class="form-input" 
                placeholder="Repite tu contraseña"
                required
              />
              <button 
                type="button" 
                class="password-toggle" 
                onclick="togglePassword('registerPasswordConfirm')"
              >
                👁️
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-secondary); cursor: pointer;">
              <input type="checkbox" id="acceptTerms" required>
              <span style="font-size: 0.875rem;">
                Acepto los <a href="#" style="color: #60a5fa;">términos y condiciones</a>
              </span>
            </label>
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
            Crear Cuenta
          </button>
          
          <div style="text-align: center; color: var(--text-tertiary); font-size: 0.875rem;">
            ¿Ya tienes cuenta? 
            <a href="#" onclick="switchToLogin()" style="color: #60a5fa; text-decoration: none;">
              Inicia sesión aquí
            </a>
          </div>
        </form>
        
        <!-- Nota para admin -->
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
          <p style="color: var(--text-tertiary); font-size: 0.75rem; text-align: center;">
            💡 <strong>Acceso Admin:</strong> Solo personal autorizado con credenciales institucionales
          </p>
        </div>
      </div>
    </div>
  `;
}

export function LoginEvents() {
  // Login Form
  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      const user = await login(email);
      
      await showAlert('¡Bienvenido!', `Hola ${user.nombre}`, 'success');
      
      if (user.rol === 'admin') {
        window.location.hash = '#/admin/dashboard';
      } else {
        window.location.hash = '#/home';
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      showAlert('Error', 'Credenciales incorrectas. Verifica tu correo y contraseña.', 'error');
    }
  });
  
  // Register Form
  const registerForm = document.getElementById('registerForm');
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    if (!acceptTerms) {
      showAlert('Error', 'Debes aceptar los términos y condiciones', 'warning');
      return;
    }
    
    if (password !== passwordConfirm) {
      showAlert('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }
    
    if (password.length < 8) {
      showAlert('Error', 'La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }
    
    const userRole = email === 'admin@uleam.edu.ec' ? 'admin' : 'estudiante';
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: name,
            rol: userRole
          }
        }
      });
      
      if (authError) throw authError;
      
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert([{
          email,
          nombre: name,
          rol: userRole
        }]);
      
      if (dbError) throw dbError;
      
      await showAlert(
        '¡Cuenta Creada!',
        `Tu cuenta ha sido creada exitosamente${userRole === 'admin' ? ' como Administrador' : ''}. Ya puedes iniciar sesión.`,
        'success'
      );
      
      switchToLogin();
      document.getElementById('loginEmail').value = email;
      
    } catch (error) {
      console.error('Error al registrar:', error);
      
      if (error.message.includes('already registered')) {
        showAlert('Error', 'Este correo ya está registrado', 'error');
      } else {
        showAlert('Error', 'No se pudo crear la cuenta: ' + error.message, 'error');
      }
    }
  });
  
  // Password strength
  const passwordInput = document.getElementById('registerPassword');
  passwordInput?.addEventListener('input', (e) => {
    const password = e.target.value;
    const strengthDiv = document.getElementById('passwordStrength');
    
    let strength = 0;
    let text = '';
    let color = '';
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    switch(strength) {
      case 0:
      case 1:
        text = 'Débil';
        color = '#ef4444';
        break;
      case 2:
        text = 'Regular';
        color = '#f59e0b';
        break;
      case 3:
        text = 'Buena';
        color = '#10b981';
        break;
      case 4:
        text = 'Excelente';
        color = '#06b6d4';
        break;
    }
    
    strengthDiv.innerHTML = password.length > 0 
      ? `<small style="color: ${color};">Seguridad: ${text}</small>`
      : '';
  });
}

// Funciones globales
window.switchToLogin = () => {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginTab').classList.add('active');
  document.getElementById('registerTab').classList.remove('active');
};

window.switchToRegister = () => {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('loginTab').classList.remove('active');
  document.getElementById('registerTab').classList.add('active');
};

window.togglePassword = (inputId) => {
  const input = document.getElementById(inputId);
  const type = input.type === 'password' ? 'text' : 'password';
  input.type = type;
};

window.showRecoverPassword = async () => {
  const { value: email } = await Swal.fire({
    title: 'Recuperar Contraseña',
    input: 'email',
    inputLabel: 'Ingresa tu correo electrónico',
    inputPlaceholder: 'ejemplo@uleam.edu.ec',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    inputValidator: (value) => {
      if (!value) {
        return 'Debes ingresar un correo';
      }
      if (!value.includes('@uleam.edu.ec')) {
        return 'Debe ser un correo @uleam.edu.ec';
      }
    }
  });
  
  if (email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password'
      });
      
      if (error) throw error;
      
      showAlert(
        'Correo Enviado',
        'Revisa tu bandeja de entrada para restablecer tu contraseña',
        'success'
      );
    } catch (error) {
      console.error('Error:', error);
      showAlert('Error', 'No se pudo enviar el correo de recuperación', 'error');
    }
  }
};

window.toggleTheme = toggleTheme;