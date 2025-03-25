document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombreCompleto = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const fechaNacimiento = document.getElementById("birthDate").value;
    const genero = document.getElementById("gender").value;
    const nacionalidad = document.getElementById("nationality").value || "No especificado";
    const password = document.getElementById("password").value.trim();

    if (!nombreCompleto || !email || !fechaNacimiento || !genero || !password) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    const usuario = { nombreCompleto, email, fechaNacimiento, genero, nacionalidad, password };

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        const data = await response.json();
        alert(data.msg);

        if (response.ok) {
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        alert("Hubo un problema con el registro.");
    }
});
