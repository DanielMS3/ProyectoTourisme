document.addEventListener("DOMContentLoaded", () => {
    const formRecuperacion = document.getElementById("form-recuperacion");
    const formCodigo = document.getElementById("form-codigo");
    const formContrasena = document.getElementById("form-contrasena");
    const mensaje = document.getElementById("mensaje");

    // Recuperar correo guardado en localStorage
    let correoUsuario = localStorage.getItem("correoUsuario") || "";

    // Enviar código de recuperación
    if (formRecuperacion) {
        formRecuperacion.addEventListener("submit", async (e) => {
            e.preventDefault();
            correoUsuario = document.getElementById("correo").value;
            localStorage.setItem("correoUsuario", correoUsuario); // Guardar el correo
    
            const res = await fetch("/api/enviar-codigo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: correoUsuario })
            });
    
            const data = await res.json();
            console.log(data); // 👉 Verifica qué responde el servidor
    
            if (mensaje) mensaje.textContent = data.mensaje || data.error;
    
            if (res.ok) {
                console.log("Redirigiendo a ingresar_codigo.html"); // 👉 Verifica si llega aquí
                window.location.href = "ingresar_codigo.html";
            }
        });
    }
    

    // Verificar código
    if (formCodigo) {
        formCodigo.addEventListener("submit", async (e) => {
            e.preventDefault();
            const codigo = document.getElementById("codigo").value;

            const res = await fetch("/api/verificar-codigo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: correoUsuario, codigo })
            });

            const data = await res.json();
            if (mensaje) mensaje.textContent = data.mensaje || data.error;

            if (res.ok) {
                window.location.href = "cambio_contrasena.html"; // Redirigir a la página de cambio de contraseña
            }
        });
    }

    // Cambiar contraseña
    if (formContrasena) {
        formContrasena.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nuevaContrasena = document.getElementById("nuevaContrasena").value;

            const res = await fetch("/api/cambiar-contrasena", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: correoUsuario, nuevaContrasena })
            });

            const data = await res.json();
            if (mensaje) mensaje.textContent = data.mensaje || data.error;

            if (res.ok) {
                alert("Contraseña cambiada con éxito.");
                localStorage.removeItem("correoUsuario"); // Eliminar el correo guardado
                window.location.href = "login.html"; // Redirigir al login
            }
        });
    }
});
