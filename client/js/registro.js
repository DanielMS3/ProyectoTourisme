document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const role = document.getElementById('role').value;
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const genero = document.getElementById('genero').value;
    const nacionalidad = document.getElementById('nacionalidad').value;

    const data = {
        role,
        nombre,
        email,
        password,
        fecha_nacimiento,
        genero,
        nacionalidad
    };

    try {
        const response = await fetch('http://localhost:3000/registro_conexion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert(result.error || 'Ocurrió un error al registrar.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de red o del servidor.');
    }
});
