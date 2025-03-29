document.addEventListener("DOMContentLoaded", () => {
    const formRecuperacion = document.getElementById("recoverForm");
    const formCodigo = document.getElementById("form-codigo");
    const formContrasena = document.getElementById("form-contrasena");
    const mensaje = document.getElementById("mensaje");

    // Recuperar correo guardado en localStorage
    let correoUsuario = localStorage.getItem("correoUsuario") || "";

    // Enviar código de recuperación
    if (formRecuperacion) {
        formRecuperacion.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // 🔍 Verificar si el input #correo existe
            const correoInput = document.getElementById("correo");
            if (!correoInput) {
                console.error("El input con id='correo' no existe.");
                return;
            }
    
            correoUsuario = correoInput.value;
            localStorage.setItem("correoUsuario", correoUsuario);
    
            const res = await fetch("http://localhost:3000/api/enviar-codigo", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: correoUsuario })
            });
    
            const data = await res.json();
            console.log(data);
    
            if (mensaje) mensaje.textContent = data.mensaje || data.error;
    
            if (res.ok) {
                console.log("Redirigiendo a ingresar_codigo.html");
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
