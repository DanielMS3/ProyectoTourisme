document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".nav-menu");
    const languageSelector = document.querySelector(".language-selector");

    // Activar/desactivar menú hamburguesa
    if (menuToggle && menu) {
        menuToggle.addEventListener("click", function () {
            menu.classList.toggle("show-menu");
        });

        document.addEventListener("click", function (event) {
            if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
                menu.classList.remove("show-menu");
            }
        });
    }

    // Activar/desactivar menú de idioma
    if (languageSelector) {
        languageSelector.addEventListener("click", function (event) {
            event.stopPropagation(); // Evita que el evento se propague al documento
            this.classList.toggle("active");
        });

        document.addEventListener("click", function (event) {
            if (!languageSelector.contains(event.target)) {
                languageSelector.classList.remove("active");
            }
        });
    }
});
