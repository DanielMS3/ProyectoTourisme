document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("Formulario de registro no encontrado.");
        return;
    }

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que la página se recargue

        // Capturamos los datos del formulario
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        // Validar si todos los campos requeridos están completos
        if (!data.nombre || !data.correo || !data.contrasena_hash || !data.rol || !data.fecha_nacimiento || !data.genero) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        // Verificar que los datos se capturaron correctamente
        console.log("Datos capturados del formulario:", data);

        try {
            // Enviar los datos al servidor
            const response = await fetch("http://localhost:3000/api/registro/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data), // Convertimos los datos a JSON
            });

            // Verificamos la respuesta
            const result = await response.json();

            if (response.ok) {
                alert("Registro exitoso. Redirigiendo al inicio de sesión...");
                window.location.href = "login.html"; // Redirigir al login
            } else {
                // Mostrar mensaje de error en caso de fallo
                console.error("Error en el servidor:", result); // Agregar detalles del error
                alert(result.message || "Error al registrar el usuario.");
            }
        } catch (error) {
            // Manejo de errores
            console.error("Error en el registro:", error);
            alert("Hubo un problema en la conexión con el servidor.");
        }
    });
});
