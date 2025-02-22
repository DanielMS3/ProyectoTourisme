let currentIndex = 0; // Asegúrate de que esta línea esté antes de cualquier uso de currentIndex

function moveSlide(direction) {
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;

    // Remover la clase 'active' del item actual
    items[currentIndex].classList.remove('active');

    // Actualizar el índice
    currentIndex = (currentIndex + direction + totalItems) % totalItems;

    // Añadir la clase 'active' al nuevo item actual
    items[currentIndex].classList.add('active');

    // Mover el carrusel
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
}
