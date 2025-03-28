document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que la página se recargue

    const correo = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;
    const fecha_nacimiento = document.getElementById('birthDate').value;
    const genero = document.getElementById('gender').value;
    const nacionalidad = document.getElementById('nationality').value;

    const userData = {correo, contrasena, fecha_nacimiento, genero, nacionalidad };

    try {
        const response = await fetch('/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            window.location.href = 'login.html'; // Redirige al login tras el registro
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error en el servidor');
    }
});
