document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");
    const nav = document.querySelector("nav"); // Agregar referencia al navbar
    const languageSelector = document.querySelector(".language-selector");

    if (menuToggle && menu && nav) {
        menuToggle.addEventListener("click", function () {
            menu.classList.toggle("active");
            nav.classList.toggle("menu-open"); // Nueva clase para expandir el fondo
        });
    }

    if (languageSelector) {
        languageSelector.addEventListener("click", function () {
            this.classList.toggle("active");
        });

        document.addEventListener("click", function (event) {
            if (!languageSelector.contains(event.target)) {
                languageSelector.classList.remove("active");
            }
        });
    }
});
