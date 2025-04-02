// Datos de los destinos 
const destinos = {
  parques: [
    {
      id: "parque-arvi",
      nombre: "Parque Arví",
      ubicacion: "Medellín",
      descripcion: "Ideal para senderismo, avistamiento de aves y picnic. Se puede llegar en metro y metrocable. El Parque Arví es una reserva natural de 16.000 hectáreas ubicada en la zona rural de Medellín. Cuenta con senderos ecológicos, miradores, lagos y zonas para picnic. Es un lugar perfecto para conectar con la naturaleza, hacer senderismo y disfrutar del aire puro. Además, ofrece actividades como avistamiento de aves, recorridos guiados y mercado campesino los fines de semana.",
      imagen: "img/parque_arvi.jpeg",
      imagenes: [
        "img/parque_arvi.jpeg",
        "img/parque_arvi_dos.jpg",
        "img/parque_arvi_tres.jpg",
        "img/parque_arvi_cuatro.jpg",
      ],
      rating: 4.8,
      reviews: 120,
      tags: ["Senderismo", "Naturaleza", "Picnic", "Avistamiento de aves", "Metrocable"],
      categoria: "parques"
    },
    // Resto de los destinos...
  ],
  // Resto de las categorías...
};

// Función para obtener parámetros de la URL
function obtenerParametrosURL() {
  const parametros = new URLSearchParams(window.location.search);
  return {
      id: parametros.get('id'),
      categoria: parametros.get('categoria')
  };
}

// Función para encontrar un destino por su ID
function encontrarDestinoPorId(id) {
  // Buscar en todas las categorías
  for (const categoria in destinos) {
      const destinoEncontrado = destinos[categoria].find(destino => destino.id === id);
      if (destinoEncontrado) {
          return destinoEncontrado;
      }
  }
  return null;
}

// Función para generar estrellas según la calificación
function generarEstrellas(rating) {
  let estrellas = "";
  const ratingEntero = Math.floor(rating);
  const tieneMedia = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
      if (i <= ratingEntero) {
          estrellas += '<i class="fas fa-star"></i>';
      } else if (i === ratingEntero + 1 && tieneMedia) {
          estrellas += '<i class="fas fa-star-half-alt"></i>';
      } else {
          estrellas += '<i class="far fa-star"></i>';
      }
  }

  return estrellas;
}

// Función para actualizar el contador de visitas
function actualizarContadorVisitas(id) {
  try {
    // Obtener el contador actual del destino desde localStorage
    let visitas = parseInt(localStorage.getItem(`visitas_${id}`), 10) || 0;

    // Incrementar el contador
    visitas++;

    // Guardar el nuevo valor en localStorage
    localStorage.setItem(`visitas_${id}`, visitas);

    // Verificar si el elemento destino-visitas existe antes de actualizarlo
    const contadorVisitas = document.getElementById('destino-visitas');
    if (contadorVisitas) {
      contadorVisitas.textContent = `Visitas: ${visitas}`;
    }
  } catch (error) {
    console.error('Error al actualizar el contador de visitas:', error);
  }
}

// Función para cargar los detalles del destino
function cargarDetallesDestino() {
  const { id } = obtenerParametrosURL();
  
  if (!id) {
      // Si no hay ID, redirigir a la página principal
      window.location.href = 'home.html';
      return;
  }

  const destino = encontrarDestinoPorId(id);
  
  if (!destino) {
      // Si no se encuentra el destino, mostrar mensaje de error
      document.querySelector('.destino-header h1').textContent = 'Destino no encontrado';
      document.querySelector('.destino-descripcion p').textContent = 'Lo sentimos, el destino que buscas no existe o ha sido removido.';
      return;
  }

  // Actualizar el título de la página
  document.title = `${destino.nombre} - Tourisme`;
  
  // Actualizar el breadcrumb
  document.getElementById('destino-breadcrumb').textContent = destino.nombre;
  
  // Actualizar los detalles del destino
  document.getElementById('destino-nombre').textContent = destino.nombre;
  document.getElementById('destino-ubicacion').textContent = destino.ubicacion;
  document.getElementById('destino-estrellas').innerHTML = generarEstrellas(destino.rating);
  document.getElementById('destino-rating').textContent = destino.rating.toFixed(1);
  document.getElementById('destino-reviews').textContent = destino.reviews;

  // Actualizar y mostrar el contador de visitas
  actualizarContadorVisitas(id);

  // Cargar la galería de imágenes
  cargarGaleriaImagenes(destino);

  document.getElementById('destino-descripcion').textContent = destino.descripcion;
  
  // Cargar tags
  const tagsContainer = document.getElementById('destino-tags-container');
  tagsContainer.innerHTML = '';
  
  destino.tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
  });

  // Cargar reseñas del destino
  cargarResenas(id);
}

// Función para cargar la galería de imágenes
function cargarGaleriaImagenes(destino) {
  // Verificar si el destino tiene imágenes
  const imagenes = destino.imagenes || [destino.imagen];
  
  // Actualizar imagen principal
  const imgPrincipal = document.getElementById('destino-img');
  imgPrincipal.src = imagenes[0]; // Usar la primera imagen como principal
  imgPrincipal.alt = destino.nombre;
  
  // Crear contenedor de miniaturas
  const galeriaContainer = document.getElementById('galeria-imagenes');
  galeriaContainer.innerHTML = '';
  
  // Agregar todas las imágenes como miniaturas
  imagenes.forEach((src, index) => {
      agregarMiniatura(galeriaContainer, src, `${destino.nombre} - imagen ${index + 1}`, index === 0);
  });
}

// Función para agregar una miniatura a la galería
function agregarMiniatura(container, src, alt, isActive = false) {
  const div = document.createElement('div');
  div.className = 'imagen-adicional';
  if (isActive) div.classList.add('active');
  
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.onclick = function() {
      cambiarImagenPrincipal(this.src);
  };
  
  div.appendChild(img);
  container.appendChild(div);
}

// Función para cambiar la imagen principal
function cambiarImagenPrincipal(src) {
  document.getElementById('destino-img').src = src;
  
  // Marcar la miniatura activa
  const miniaturas = document.querySelectorAll('.imagen-adicional');
  miniaturas.forEach(miniatura => {
      if (miniatura.querySelector('img').src === src) {
          miniatura.classList.add('active');
      } else {
          miniatura.classList.remove('active');
      }
  });
}

// Función para cargar las reseñas del destino
function cargarResenas(destinoId) {
  // Obtener reseñas del localStorage o inicializar un array vacío
  const resenasGuardadas = JSON.parse(localStorage.getItem(`resenas_${destinoId}`)) || [];
  
  // Verificar si existe el contenedor de reseñas
  const resenasContainer = document.getElementById('resenas-container');
  if (!resenasContainer) return;
  
  // Limpiar el contenedor
  resenasContainer.innerHTML = '';
  
  if (resenasGuardadas.length === 0) {
    // Mostrar mensaje de que no hay reseñas
    const noResenasMsg = document.createElement('p');
    noResenasMsg.className = 'no-resenas';
    noResenasMsg.id = 'no-resenas-mensaje';
    noResenasMsg.textContent = 'No hay reseñas disponibles para este destino. ¡Sé el primero en calificar!';
    resenasContainer.appendChild(noResenasMsg);
    return;
  }
  
  // Ordenar reseñas por fecha (más recientes primero)
  resenasGuardadas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
  // Generar tarjetas de reseñas
  resenasGuardadas.forEach(resena => {
    const resenaElement = document.createElement('div');
    resenaElement.className = 'testimonio-card';
    resenaElement.innerHTML = `
      <div class="cliente-info">
        <div class="cliente-icon">
          <i class="fas fa-user"></i>
        </div>
        <div>
          <h3>${resena.nombre_usuario}</h3>
          <p>${resena.ubicacion_usuario}</p>
        </div>
      </div>
      <div class="rating">
        ${generarEstrellas(resena.calificacion)}
      </div>
      <p class="comentario">"${resena.comentario}"</p>
      <p class="fecha-resena">Fecha: ${formatearFecha(resena.fecha)}</p>
    `;
    resenasContainer.appendChild(resenaElement);
  });
}

// Función para formatear fecha
function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Función para configurar el modal de calificación
function configurarModalCalificacion() {
  const btnCalificar = document.getElementById('btn-calificar');
  const modal = document.getElementById('modalCalificacion');
  const closeModal = document.querySelector('.close-modal');
  const estrellas = document.querySelectorAll('.stars-container i');
  const ratingText = document.querySelector('.rating-text');
  const btnGuardar = document.getElementById('guardar-calificacion');
  const btnCancelar = document.getElementById('cancelar-calificacion');
  
  let calificacionSeleccionada = 0;
  
  // Función para abrir el modal
  function abrirModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
    
    // Resetear el formulario
    document.getElementById('comentario-usuario').value = '';
    document.getElementById('nombre-usuario').value = '';
    document.getElementById('ubicacion-usuario').value = '';
    calificacionSeleccionada = 0;
    estrellas.forEach(e => e.className = 'far fa-star');
    ratingText.textContent = 'Selecciona una calificación';
  }
  
  // Función para cerrar el modal
  function cerrarModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
  }
  
  // Abrir modal al hacer clic en el botón Calificar
  btnCalificar.addEventListener('click', abrirModal);
  
  // Cerrar modal con el botón de cerrar (X)
  closeModal.addEventListener('click', cerrarModal);
  
  // Cerrar modal con el botón Cancelar
  btnCancelar.addEventListener('click', cerrarModal);
  
  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      cerrarModal();
    }
  });
  
  // Funcionalidad de selección de estrellas
  estrellas.forEach(estrella => {
    estrella.addEventListener('mouseover', function() {
      const valor = parseInt(this.getAttribute('data-value'));
      
      // Resetear todas las estrellas
      estrellas.forEach(e => e.className = 'far fa-star');
      
      // Rellenar estrellas sta la actual
      for (let i = 0; i < valor; i++) {
        estrellas[i].className = 'fas fa-star';
      }
      
      // Actualizar texto
      actualizarTextoCalificacion(valor);
    });
    
    estrella.addEventListener('mouseout', function() {
      // Restaurar estado seleccionado
      estrellas.forEach(e => e.className = 'far fa-star');
      
      if (calificacionSeleccionada > 0) {
        for (let i = 0; i < calificacionSeleccionada; i++) {
          estrellas[i].className = 'fas fa-star';
        }
        actualizarTextoCalificacion(calificacionSeleccionada);
      } else {
        ratingText.textContent = 'Selecciona una calificación';
      }
    });
    
    estrella.addEventListener('click', function() {
      calificacionSeleccionada = parseInt(this.getAttribute('data-value'));
      
      // Actualizar estrellas
      estrellas.forEach(e => e.className = 'far fa-star');
      for (let i = 0; i < calificacionSeleccionada; i++) {
        estrellas[i].className = 'fas fa-star';
      }
      
      actualizarTextoCalificacion(calificacionSeleccionada);
    });
  });
  
  // Guardar calificación
  btnGuardar.addEventListener('click', function() {
    const { id } = obtenerParametrosURL();
    const comentario = document.getElementById('comentario-usuario').value;
    const nombre = document.getElementById('nombre-usuario').value;
    const ubicacion = document.getElementById('ubicacion-usuario').value;
    
    if (calificacionSeleccionada === 0) {
      alert('Por favor, selecciona una calificación');
      return;
    }
    
    if (!comentario.trim()) {
      alert('Por favor, escribe un comentario');
      return;
    }
    
    if (!nombre.trim()) {
      alert('Por favor, ingresa tu nombre');
      return;
    }
    
    // Crear objeto de reseña
    const nuevaResena = {
      id_usuario: Date.now(), // ID temporal
      id_destino: id,
      nombre_usuario: nombre,
      ubicacion_usuario: ubicacion || 'No especificada',
      calificacion: calificacionSeleccionada,
      comentario: comentario,
      fecha: new Date().toISOString().split('T')[0]
    };
    
    // Guardar la reseña en localStorage
    guardarResena(id, nuevaResena);
    
    // Actualizar contador de reseñas
    actualizarContadorResenas(id);
    
    // Cerrar el modal
    cerrarModal();
    
    // Recargar las reseñas
    cargarResenas(id);
    
    // Mostrar mensaje de éxito
    alert('¡Gracias por tu calificación!');
  });
}

// Función para guardar una reseña
function guardarResena(destinoId, resena) {
  // Obtener reseñas existentes o inicializar array
  const resenasGuardadas = JSON.parse(localStorage.getItem(`resenas_${destinoId}`)) || [];
  
  // Agregar nueva reseña
  resenasGuardadas.push(resena);
  
  // Guardar en localStorage
  localStorage.setItem(`resenas_${destinoId}`, JSON.stringify(resenasGuardadas));
  
  // Ocultar el mensaje de "no hay reseñas" si existe
  const noResenasMsg = document.getElementById('no-resenas-mensaje');
  if (noResenasMsg) {
    noResenasMsg.style.display = 'none';
  }
}

// Función para actualizar el contador de reseñas
function actualizarContadorResenas(destinoId) {
  const resenasGuardadas = JSON.parse(localStorage.getItem(`resenas_${destinoId}`)) || [];
  const destino = encontrarDestinoPorId(destinoId);
  
  if (destino) {
    const totalResenas = destino.reviews + resenasGuardadas.length;
    document.getElementById('destino-reviews').textContent = totalResenas;
    
    // Actualizar calificación promedio
    actualizarCalificacionPromedio(destinoId, destino, resenasGuardadas);
  }
}

// Función para actualizar la calificación promedio
function actualizarCalificacionPromedio(destinoId, destino, resenas) {
  if (resenas.length === 0) return;
  
  // Calcular el promedio de calificaciones
  const sumaCalificaciones = resenas.reduce((total, resena) => total + resena.calificacion, 0);
  const promedioCalificaciones = sumaCalificaciones / resenas.length;
  
  // Calcular el nuevo promedio considerando las calificaciones originales
  const calificacionesOriginales = destino.rating * destino.reviews;
  const totalCalificaciones = calificacionesOriginales + sumaCalificaciones;
  const totalResenas = destino.reviews + resenas.length;
  const nuevoPromedio = totalCalificaciones / totalResenas;
  
  // Actualizar en la interfaz
  document.getElementById('destino-rating').textContent = nuevoPromedio.toFixed(1);
  document.getElementById('destino-estrellas').innerHTML = generarEstrellas(nuevoPromedio);
}

// Función para actualizar el texto de calificación
function actualizarTextoCalificacion(valor) {
  const ratingText = document.querySelector('.rating-text');
  switch (valor) {
    case 1:
      ratingText.textContent = 'Malo';
      break;
    case 2:
      ratingText.textContent = 'Regular';
      break;
    case 3:
      ratingText.textContent = 'Bueno';
      break;
    case 4:
      ratingText.textContent = 'Muy bueno';
      break;
    case 5:
      ratingText.textContent = 'Excelente';
      break;
    default:
      ratingText.textContent = 'Selecciona una calificación';
  }
}

// Evento para el menú móvil
document.getElementById("menuToggle").addEventListener("click", () => {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("active");
});

// Inicializar la página
document.addEventListener("DOMContentLoaded", () => {
  // Cargar los detalles del destino
  cargarDetallesDestino();
  
  // Configurar el modal de calificación
  configurarModalCalificacion();
  
  // Establecer el año actual en el footer
  document.getElementById("year").textContent = new Date().getFullYear();
});