document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();


    // Obtener los valores del formulario
    const role = document.getElementById('role').value;
    const correo = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasena').value;
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const genero = document.getElementById('genero').value;
    const nacionalidad = document.getElementById('nacionalidad').value;


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
    .then(response => response.json())
    .then(data => {
        if (response.ok){
            alert(data.message);
        } else {
            alert(data.error);
        }
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