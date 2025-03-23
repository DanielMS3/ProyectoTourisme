document.addEventListener('DOMContentLoaded', function() {
    // Referencia al formulario de login
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    
    // Manejar el envío del formulario de login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // Mostrar indicador de carga (puedes añadir un spinner aquí)
            document.querySelector('.login-btn').innerHTML = 'Iniciando sesión...';
            document.querySelector('.login-btn').disabled = true;
            
            // Enviar solicitud al servidor
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Login exitoso - redirigir al dashboard
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/destinos.html'; // Redirigir a la página de destinos
            } else {
                // Mostrar mensaje de error
                showError(data.message || 'Error al iniciar sesión. Verifica tus credenciales.');
            }
        } catch (error) {
            showError('Error de conexión. Intenta nuevamente más tarde.');
            console.error('Error:', error);
        } finally {
            // Restaurar el botón
            document.querySelector('.login-btn').innerHTML = 'Iniciar sesión <i class="fas fa-arrow-right"></i>';
            document.querySelector('.login-btn').disabled = false;
        }
    });
    
    // Manejar el botón de login con Google
    googleLoginBtn.addEventListener('click', function() {
        // Iniciar el flujo de autenticación de Google
        initiateGoogleLogin();
    });
    
    // Función para iniciar el login con Google
    function initiateGoogleLogin() {
        // Redirigir al endpoint de autenticación de Google
        window.location.href = '/api/auth/google';
    }
    
    // Función para mostrar mensajes de error
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    // Manejar la visibilidad de la contraseña
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Cambiar el ícono
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
});