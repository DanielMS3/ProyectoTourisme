document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const role = document.getElementById('role').value;
    const email = document.getElementById('correo').value;
    const password = document.getElementById('password').value;
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const genero = document.getElementById('genero').value;
    const nacionalidad = document.getElementById('nacionalidad').value;

    // Realizar la solicitud a la API
    fetch('http://localhost:3000/api/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            role,
            correo,
            contrasena,
            fecha_nacimiento,
            genero,
            nacionalidad,
        }),
    })
    .then(response => {
        if (!response.ok) { // Verifica que la respuesta sea exitosa antes de convertirla
            return response.json().then(data => {
                throw new Error(data.error || 'Error en el registro');
            });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error en el registro.');
    });
});

const togglePassword = document.querySelector('.toggle-password');
const password = document.querySelector('#contrasena');

togglePassword.addEventListener('click', function (e) {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});
