document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío del formulario

    const correo = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });

        const result = await response.json();

        if (response.ok) {
            // Guardar el token en localStorage
            localStorage.setItem('token', result.token);
            alert('Inicio de sesión exitoso');
            window.location.href = 'index.html'; // Redirigir al usuario a la página principal
        } else {
            errorMessage.textContent = result.error; // Mostrar mensaje de error
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error en el login:', error);
        errorMessage.textContent = 'Error en el servidor';
        errorMessage.style.display = 'block';
    }
});

// Mostrar/ocultar contraseña
document.querySelector('.toggle-password').addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('.toggle-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});
