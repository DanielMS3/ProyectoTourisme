// Actualizar el año en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

// Cerrar el menú móvil al hacer clic en un enlace
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Tabs de búsqueda
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remover clase active de todas las tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Agregar clase active a la tab actual
        tab.classList.add('active');
        
        // Ocultar todos los contenidos
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
        
        // Mostrar el contenido correspondiente
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(`${tabId}Content`).style.display = 'block';
    });
});

// Inicializar fechas en los inputs de tipo date
const dateInputs = document.querySelectorAll('input[type="date"]');
const today = new Date().toISOString().split('T')[0];

dateInputs.forEach(input => {
    input.min = today;
    
    // Si es un input de fecha de vuelta o checkout, establecer una fecha por defecto de 7 días después
    if (input.id.includes('Vuelta') || input.id.includes('Out')) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        input.value = defaultDate.toISOString().split('T')[0];
    } else {
        // Para fechas de ida o checkin, establecer la fecha actual
        input.value = today;
    }
});

// Animación de scroll suave para los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Restar la altura del header
                behavior: 'smooth'
            });
        }
    });
});

// Validación simple del formulario de búsqueda
const searchForms = document.querySelectorAll('.search-form');

searchForms.forEach(form => {
    const searchBtn = form.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const requiredInputs = form.querySelectorAll('input:not([type="date"])');
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#dc3545';
                
                // Restaurar el estilo después de que el usuario comience a escribir
                input.addEventListener('input', function() {
                    this.style.borderColor = '#ddd';
                }, { once: true });
            }
        });
        
        if (isValid) {
            alert('¡Búsqueda realizada con éxito! En un sistema real, aquí se mostrarían los resultados.');
        } else {
            alert('Por favor, completa todos los campos requeridos.');
        }
    });
});

// Efecto hover en las tarjetas de destinos
const destinoCards = document.querySelectorAll('.destino-card');

destinoCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
    });
});