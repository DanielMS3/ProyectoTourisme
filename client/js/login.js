document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('error-message');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Redirige según el rol
            if (data.rol === 'usuario') {
                window.location.href = 'home.html';
            } else if (data.rol === 'negocio') {
                window.location.href = 'empresa.html';
            } else {
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'Rol no reconocido.';
            }
        } else {
            errorDiv.style.display = 'block';
            errorDiv.textContent = data.error || 'Error al iniciar sesión';
        }
    } catch (error) {
        console.error('Error al enviar login:', error);
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Error de conexión con el servidor';
    }
});
