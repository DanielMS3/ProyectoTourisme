document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que la página se recargue


    // Obtener los valores del formulario
    const rol = document.getElementById('rol').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const genero = document.getElementById('genero').value;
    const nacionalidad = document.getElementById('nacionalidad').value;


    // Validación para campos vacios 
    if (rol === '' || correo === '' || contrasena === '' || fecha_nacimiento === '' 
        || genero === '' || nacionalidad === '') {
        alert('Por favor, rellene todos los campos obligatorios.');
        return;
    }

    const userData = {rol, correo, contrasena, fecha_nacimiento, genero, nacionalidad };

    try {
        const response = await fetch('/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            window.location.href = '../login.html'; // Redirige al login tras el registro
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error en el servidor');
    }
});
