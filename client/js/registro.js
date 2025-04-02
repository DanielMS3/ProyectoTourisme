document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("Formulario de registro no encontrado.");
        return;
    }

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que la página se recargue

        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("http://localhost:3000/api/registro/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Registro exitoso. Redirigiendo al inicio de sesión...");
                window.location.href = "login.html"; // Redirigir al login
            } else {
                alert(result.message || "Error al registrar el usuario.");
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Hubo un problema en la conexión con el servidor.");
        }
    });
});
