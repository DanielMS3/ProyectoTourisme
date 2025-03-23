document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const registerForm = document.getElementById('registerForm');
    const avatarInput = document.getElementById('avatarInput');
    const avatarUploadBtn = document.getElementById('avatarUploadBtn');
    const avatarPreview = document.getElementById('avatarPreview');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    
    // Agregar un div para mensajes de error/éxito si no existe
    let messageContainer = document.createElement('div');
    messageContainer.id = 'message-container';
    messageContainer.style.display = 'none';
    messageContainer.style.padding = '10px';
    messageContainer.style.borderRadius = '5px';
    messageContainer.style.marginBottom = '15px';
    messageContainer.style.textAlign = 'center';
    
    // Insertar antes del formulario
    if (registerForm) {
        registerForm.parentNode.insertBefore(messageContainer, registerForm);
    }
    
    // Manejar la subida de avatar
    if (avatarUploadBtn && avatarInput) {
        avatarUploadBtn.addEventListener('click', function() {
            avatarInput.click();
        });
        
        avatarInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Manejar la visibilidad de la contraseña
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Cambiar el ícono
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Manejar el envío del formulario
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const birthDate = document.getElementById('birthDate').value;
            const gender = document.getElementById('gender').value;
            const nationality = document.getElementById('nationality').value;
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const avatarFile = avatarInput.files[0];
            
            // Validaciones básicas
            if (!fullName || !email || !birthDate || !gender || !username || !password) {
                showMessage('Por favor, completa todos los campos obligatorios.', 'error');
                return;
            }
            
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Por favor, introduce un correo electrónico válido.', 'error');
                return;
            }
            
            // Validar edad (mínimo 18 años)
            const today = new Date();
            const birthDateObj = new Date(birthDate);
            let age = today.getFullYear() - birthDateObj.getFullYear();
            const monthDiff = today.getMonth() - birthDateObj.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
                age--;
            }
            
            if (age < 18) {
                showMessage('Debes ser mayor de 18 años para registrarte.', 'error');
                return;
            }
            
            // Validar contraseña (mínimo 8 caracteres)
            if (password.length < 8) {
                showMessage('La contraseña debe tener al menos 8 caracteres.', 'error');
                return;
            }
            
            try {
                // Mostrar indicador de carga
                const submitBtn = document.querySelector('.register-btn');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Procesando... <i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;
                
                // Crear objeto FormData para enviar archivos
                const formData = new FormData();
                formData.append('fullName', fullName);
                formData.append('email', email);
                formData.append('birthDate', birthDate);
                formData.append('gender', gender);
                formData.append('nationality', nationality);
                formData.append('username', username);
                formData.append('password', password);
                
                if (avatarFile) {
                    formData.append('avatar', avatarFile);
                }
                
                // Enviar datos al servidor
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                // Restaurar el botón
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                if (response.ok) {
                    // Registro exitoso
                    showMessage('¡Registro exitoso! Redirigiendo al inicio de sesión...', 'success');
                    
                    // Limpiar el formulario
                    registerForm.reset();
                    avatarPreview.src = 'https://via.placeholder.com/150';
                    
                    // Redirigir al login después de 2 segundos
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 2000);
                } else {
                    // Error en el registro
                    showMessage(data.message || 'Error al registrar usuario. Inténtalo de nuevo.', 'error');
                }
                
            } catch (error) {
                console.error('Error:', error);
                showMessage('Error de conexión. Por favor, inténtalo más tarde.', 'error');
                
                // Restaurar el botón
                const submitBtn = document.querySelector('.register-btn');
                submitBtn.innerHTML = 'Crear cuenta <i class="fas fa-arrow-right"></i>';
                submitBtn.disabled = false;
            }
        });
    }
    
    // Función para mostrar mensajes
    function showMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        
        if (type === 'error') {
            messageContainer.style.backgroundColor = '#ffebee';
            messageContainer.style.color = '#c62828';
            messageContainer.style.border = '1px solid #ffcdd2';
        } else {
            messageContainer.style.backgroundColor = '#e8f5e9';
            messageContainer.style.color = '#2e7d32';
            messageContainer.style.border = '1px solid #c8e6c9';
        }
        
        // Desplazar hacia el mensaje
        messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Ocultar el mensaje después de 5 segundos si es de error
        if (type === 'error') {
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    }
});