// Datos de los destinos
const destinos = {
    parques: [
      {
        nombre: "Parque Arví",
        ubicacion: "Medellín",
        descripcion: "Ideal para senderismo, avistamiento de aves y picnic. Se puede llegar en metro y metrocable.",
        imagen: "img/parque_arvi.jpeg",
        rating: 4.8,
        reviews: 120,
        tags: ["Senderismo", "Naturaleza", "Picnic"],
      },
      {
        nombre: "Cerro El Volador",
        ubicacion: "Medellín",
        descripcion: "Uno de los cerros tutelares con miradores y senderos ecológicos.",
        imagen: "img/cerro_volador.jpg",
        rating: 4.5,
        reviews: 95,
        tags: ["Senderismo", "Mirador", "Deportes"],
      },
      {
        nombre: "Parque Ecológico Piedras Blancas",
        ubicacion: "Santa Elena",
        descripcion: "Un bosque con lagos, senderos y el Mariposario de Comfama.",
        imagen: "img/parque_piedras_blancas.jpg",
        rating: 4.7,
        reviews: 110,
        tags: ["Lagos", "Mariposario", "Naturaleza"],
      },
      {
        nombre: "Ecoparque La Romera",
        ubicacion: "Sabaneta",
        descripcion: "Reserva natural con biodiversidad y senderos ecológicos.",
        imagen: "img/ecoparque_romera.jpg",
        rating: 4.6,
        reviews: 85,
        tags: ["Reserva", "Biodiversidad", "Senderismo"],
      },
      {
        nombre: "Cascada Salto del Ángel",
        ubicacion: "Envigado",
        descripcion: "Una hermosa cascada escondida en las montañas de Envigado.",
        imagen: "img/cascada_salto_angel.jpg",
        rating: 4.9,
        reviews: 75,
        tags: ["Cascada", "Naturaleza", "Aventura"],
      },
      {
        nombre: "Quebrada La Miel",
        ubicacion: "El Retiro",
        descripcion: "Perfecto para caminatas y baños naturales.",
        imagen: "img/quebrada_miel.jpg",
        rating: 4.7,
        reviews: 65,
        tags: ["Río", "Baño natural", "Caminata"],
      },
      {
        nombre: "Reserva Natural La Honda",
        ubicacion: "Bello",
        descripcion: "Un destino poco conocido con cascadas, bosques de niebla y una biodiversidad sorprendente.",
        imagen: "img/reserva_honda.jpg",
        rating: 4.8,
        reviews: 55,
        tags: ["Cascadas", "Bosque", "Biodiversidad"],
      },
      {
        nombre: "Reserva Natural San Sebastián-La Castellana",
        ubicacion: "Medellín",
        descripcion: "Un espacio verde dentro de la ciudad con senderos ecológicos y biodiversidad.",
        imagen: "img/reserva_castellana.jpg",
        rating: 4.5,
        reviews: 60,
        tags: ["Urbano", "Senderos", "Biodiversidad"],
      },
      {
        nombre: "Bosque de Niebla San Sebastián de la Castellana",
        ubicacion: "Medellín",
        descripcion:
          "Una reserva ecológica dentro de Medellín, ideal para senderismo, observación de fauna y desconexión total del ruido urbano.",
        imagen: "img/bosque_niebla_castellana.jpg",
        rating: 4.6,
        reviews: 70,
        tags: ["Bosque", "Fauna", "Tranquilidad"],
      },
    ],
    miradores: [
      {
        nombre: "Mirador Las Palmas",
        ubicacion: "Medellín",
        descripcion: "Vista panorámica de la ciudad, ideal para ir de noche.",
        imagen: "img/mirador_palmas.jpg",
        rating: 4.9,
        reviews: 150,
        tags: ["Panorámica", "Nocturno", "Romántico"],
      },
      {
        nombre: "Mirador San Félix",
        ubicacion: "Bello",
        descripcion: "Conocido por los vuelos en parapente y una vista espectacular.",
        imagen: "img/mirador_felix.jpg",
        rating: 4.8,
        reviews: 130,
        tags: ["Parapente", "Vista", "Aventura"],
      },
      {
        nombre: "Mirador de Sabaneta",
        ubicacion: "Sabaneta",
        descripcion: "Un lugar tranquilo para ver la ciudad desde las alturas.",
        imagen: "img/mirador_sabaneta.jpg",
        rating: 4.6,
        reviews: 90,
        tags: ["Tranquilo", "Vista", "Familiar"],
      },
      {
        nombre: "Mirador del cielo",
        ubicacion: "Medellín",
        descripcion: "Un lugar atractivo que ofrece vistas panorámicas de la ciudad.",
        imagen: "img/mirador_cielo.jpg",
        rating: 4.7,
        reviews: 85,
        tags: ["Panorámica", "Fotografía", "Turístico"],
      },
      {
        nombre: "Cerro Quitasol",
        ubicacion: "Bello",
        descripcion: "Desde aquí podrá ver una panorámica del municipio siendo el mirador principal.",
        imagen: "img/cerro_quitasol.jpg",
        rating: 4.5,
        reviews: 75,
        tags: ["Senderismo", "Panorámica", "Naturaleza"],
      },
      {
        nombre: "Mirador Cerro El Picacho",
        ubicacion: "Medellín",
        descripcion:
          "Uno de los puntos más altos de la ciudad con una vista espectacular, ideal para caminatas y avistamiento de aves.",
        imagen: "img/mirador_picacho.jpg",
        rating: 4.6,
        reviews: 80,
        tags: ["Altura", "Aves", "Caminata"],
      },
      {
        nombre: "Mirador Cerro de Las Tres Cruces",
        ubicacion: "Medellín",
        descripcion: "Un punto muy popular entre los deportistas con una vista impresionante de Medellín.",
        imagen: "img/mirador_tres_cruzes.jpg",
        rating: 4.7,
        reviews: 110,
        tags: ["Deporte", "Vista", "Popular"],
      },
      {
        nombre: "Mirador La Asomadera",
        ubicacion: "Medellín",
        descripcion:
          "Un lugar tranquilo dentro de la ciudad con una vista panorámica perfecta para desconectarse del ruido urbano.",
        imagen: "img/mirador_asomadera.jpg",
        rating: 4.5,
        reviews: 70,
        tags: ["Tranquilo", "Urbano", "Panorámica"],
      },
      {
        nombre: "Mirador de San Javier",
        ubicacion: "Medellín",
        descripcion: "Perfecto para admirar la Comuna 13 desde lo alto y disfrutar de su vibrante cultura.",
        imagen: "img/mirador_san_javier.jpg",
        rating: 4.8,
        reviews: 95,
        tags: ["Comuna 13", "Cultural", "Urbano"],
      },
    ],
    museos: [
      {
        nombre: "Museo de Antioquia y Plaza Botero",
        ubicacion: "Medellín",
        descripcion: "Exhibe obras de Fernando Botero y tiene una gran colección de arte.",
        imagen: "img/plaza_botero.jpg",
        rating: 4.9,
        reviews: 200,
        tags: ["Arte", "Botero", "Cultural"],
      },
      {
        nombre: "Casa de la Memoria",
        ubicacion: "Medellín",
        descripcion: "Un museo sobre la historia del conflicto en Colombia.",
        imagen: "img/museo_memoria.jpg",
        rating: 4.8,
        reviews: 150,
        tags: ["Historia", "Conflicto", "Educativo"],
      },
      {
        nombre: "Pueblito Paisa",
        ubicacion: "Medellín",
        descripcion: "Una réplica de un pueblo tradicional con una vista panorámica de la ciudad.",
        imagen: "img/pueblito_paisa.jpg",
        rating: 4.7,
        reviews: 180,
        tags: ["Tradicional", "Panorámica", "Cultural"],
      },
      {
        nombre: "Catedral Basílica Metropolitana",
        ubicacion: "Medellín",
        descripcion: "Una de las iglesias de ladrillo más grandes del mundo.",
        imagen: "img/catedral_metropolitana_medellin.jpg",
        rating: 4.6,
        reviews: 120,
        tags: ["Religioso", "Arquitectura", "Histórico"],
      },
      {
        nombre: "Cementerio Museo San Pedro",
        ubicacion: "Medellín",
        descripcion: "Un lugar con valor histórico y cultural.",
        imagen: "img/cementerio_san_pedro.jpg",
        rating: 4.5,
        reviews: 90,
        tags: ["Histórico", "Cultural", "Arquitectura"],
      },
    ],
    actividades: [
      {
        nombre: "Parapente en San Félix",
        ubicacion: "Bello",
        descripcion: "Una de las mejores experiencias para volar sobre el Valle de Aburrá.",
        imagen: "img/parepente_san_felix.jpg",
        rating: 4.9,
        reviews: 200,
        tags: ["Aventura", "Vuelo", "Adrenalina"],
      },
      {
        nombre: "Ciclovía Medellín",
        ubicacion: "Medellín",
        descripcion: "Los domingos, la ciudad abre varias calles para ciclistas y deportistas.",
        imagen: "img/ciclovia_medellin.jpg",
        rating: 4.7,
        reviews: 150,
        tags: ["Deporte", "Bicicleta", "Domingos"],
      },
      {
        nombre: "Senderismo en el Cerro de las Tres Cruces",
        ubicacion: "Medellín",
        descripcion: "Un buen reto con vista increíble.",
        imagen: "img/senderismo_tres_cruzes.jpg",
        rating: 4.8,
        reviews: 130,
        tags: ["Senderismo", "Deporte", "Vista"],
      },
      {
        nombre: "Salto del Tequendamita",
        ubicacion: "El Retiro",
        descripcion: "Una cascada impresionante ideal para el senderismo.",
        imagen: "img/salto_tequendamita.jpg",
        rating: 4.6,
        reviews: 85,
        tags: ["Cascada", "Senderismo", "Naturaleza"],
      },
      {
        nombre: "Patinaje en el Aeroparque Juan Pablo II",
        ubicacion: "Medellín",
        descripcion: "Pistas adecuadas para patinadores y actividades deportivas.",
        imagen: "img/patinaje_juan_pablo.jpg",
        rating: 4.5,
        reviews: 90,
        tags: ["Patinaje", "Deporte", "Recreación"],
      },
      {
        nombre: "Paseo en bicicleta por la Avenida Las Palmas",
        ubicacion: "Medellín",
        descripcion: "Ruta exigente para ciclistas con panorámicas increíbles.",
        imagen: "img/cicloviaa_avenida_palmas.jpg",
        rating: 4.7,
        reviews: 110,
        tags: ["Ciclismo", "Panorámica", "Deporte"],
      },
      {
        nombre: "Senderismo en el Cerro Pan de Azúcar",
        ubicacion: "Medellín",
        descripcion: "Una caminata desafiante con vistas espectaculares de la ciudad.",
        imagen: "img/senderismo_cerro_pan.jpg",
        rating: 4.6,
        reviews: 95,
        tags: ["Senderismo", "Desafiante", "Vista"],
      },
      {
        nombre: "Parque Comfama Arví",
        ubicacion: "Medellín",
        descripcion:
          "Espacio con actividades al aire libre como senderismo, canopy y circuitos de aventura dentro del Parque Arví.",
        imagen: "img/parque_confama_arvi.jpg",
        rating: 4.8,
        reviews: 140,
        tags: ["Canopy", "Aventura", "Familiar"],
      },
      {
        nombre: "Rutas de downhill en la Loma del Escobero",
        ubicacion: "Medellín",
        descripcion: "Destino popular para los amantes del ciclismo de descenso con rutas técnicas y desafiantes.",
        imagen: "img/ciclismo_loma_escobero.jpg",
        rating: 4.9,
        reviews: 80,
        tags: ["Downhill", "Ciclismo", "Extremo"],
      },
    ],
    plazas: [
      {
        nombre: "Comuna 13",
        ubicacion: "Medellín",
        descripcion: "Un recorrido lleno de arte urbano, música y cultura.",
        imagen: "img/Comuna13.webp",
        rating: 4.9,
        reviews: 250,
        tags: ["Arte urbano", "Cultural", "Turístico"],
      },
      {
        nombre: "Acuaparque Ditaires",
        ubicacion: "Itagüí",
        descripcion: "Parque acuático con piscinas y toboganes.",
        imagen: "img/acuaparque_ditaires.jpg",
        rating: 4.6,
        reviews: 180,
        tags: ["Acuático", "Familiar", "Recreación"],
      },
      {
        nombre: "Parque de los Pies Descalzos",
        ubicacion: "Medellín",
        descripcion: "Un espacio interactivo con fuentes y jardines zen.",
        imagen: "img/parque_pies_descalzos.jpg",
        rating: 4.7,
        reviews: 160,
        tags: ["Interactivo", "Zen", "Relajación"],
      },
      {
        nombre: "Explora Parque y Planetario",
        ubicacion: "Medellín",
        descripcion: "Ciencia, tecnología y astronomía en un solo lugar.",
        imagen: "img/parque_explora.jpg",
        rating: 4.8,
        reviews: 200,
        tags: ["Ciencia", "Educativo", "Familiar"],
      },
      {
        nombre: "Jardín Botánico de Medellín",
        ubicacion: "Medellín",
        descripcion: "Un pulmón verde en la ciudad con mariposario y lagunas.",
        imagen: "img/jardin_botanico.jpg",
        rating: 4.9,
        reviews: 220,
        tags: ["Naturaleza", "Mariposario", "Urbano"],
      },
      {
        nombre: "Zoológico Santa Fe",
        ubicacion: "Medellín",
        descripcion: "Hogar de especies locales y exóticas.",
        imagen: "img/zoologico_santa_fe.jpg",
        rating: 4.5,
        reviews: 190,
        tags: ["Animales", "Familiar", "Educativo"],
      },
      {
        nombre: "Parque Norte",
        ubicacion: "Medellín",
        descripcion: "Parque de diversiones con atracciones mecánicas y actividades recreativas.",
        imagen: "img/parque_norte_medellin.jpg",
        rating: 4.6,
        reviews: 210,
        tags: ["Diversiones", "Atracciones", "Familiar"],
      },
      {
        nombre: "Parque de Bello",
        ubicacion: "Bello",
        descripcion: "Lugar emblemático con arquitectura colonial y ambiente tradicional.",
        imagen: "img/parque_bello.jpg",
        rating: 4.4,
        reviews: 120,
        tags: ["Colonial", "Tradicional", "Histórico"],
      },
      {
        nombre: "Centro Cultural Moravia",
        ubicacion: "Medellín",
        descripcion: "Espacio de arte y comunidad con jardines y exposiciones.",
        imagen: "img/centro_moravia.jpg",
        rating: 4.7,
        reviews: 140,
        tags: ["Cultural", "Arte", "Comunitario"],
      },
      {
        nombre: "El Callejón del Artesano",
        ubicacion: "Bello",
        descripcion: "En el parque principal se pueden conseguir todo tipo de artesanías de la región.",
        imagen: "img/callejon_artesano.jpg",
        rating: 4.5,
        reviews: 100,
        tags: ["Artesanías", "Cultural", "Compras"],
      },
      {
        nombre: "Parque Principal de Sabaneta",
        ubicacion: "Sabaneta",
        descripcion: "Un lugar tradicional con ambiente familiar y gastronómico.",
        imagen: "img/parque_sabaneta.jpg",
        rating: 4.6,
        reviews: 150,
        tags: ["Gastronómico", "Familiar", "Tradicional"],
      },
      {
        nombre: "Parque Principal de La Estrella",
        ubicacion: "La Estrella",
        descripcion:
          "Centro de reunión con jardines, fuente y quiosco donde se realizan eventos culturales. Está rodeado de cafés y restaurantes, ideal para pasear y disfrutar del ambiente.",
        imagen: "img/parque_estrella.jpg",
        rating: 4.5,
        reviews: 110,
        tags: ["Cultural", "Cafés", "Relajación"],
      },
    ],
  }

  
  // Función para crear una tarjeta de destino
function crearTarjetaDestino(destino) {
  // Asignar una categoría y un ID al destino si no los tiene
  if (!destino.categoria) {
      // Intentar determinar la categoría basada en dónde se encuentra el destino en el objeto destinos
      for (const categoria in destinos) {
          if (destinos[categoria].includes(destino)) {
              destino.categoria = categoria;
              break;
          }
      }
  }

 // Funcionalidad de autenticación

document.addEventListener("DOMContentLoaded", function () {
  const userIcon = document.querySelector(".user-icon");
  const logoutButton = document.querySelector(".logout-wrapper button");

  // Verificar si el usuario está autenticado
  function checkAuthStatus() {
      if (localStorage.getItem("isLoggedIn") !== "true") {
          window.location.href = "login.html"; // Redirigir si no está logueado
      }
  }

  // Simulación de inicio de sesión (solo se ejecuta en login.html)
  if (window.location.pathname.includes("login.html")) {
      const loginForm = document.querySelector("form");
      if (loginForm) {
          loginForm.addEventListener("submit", function (e) {
              e.preventDefault(); // Simulación, reemplazar con validación real
              localStorage.setItem("isLoggedIn", "true");
              window.location.href = "home.html"; // Redirigir a home
          });
      }
  }

  // Cerrar sesión
  if (logoutButton) {
      logoutButton.addEventListener("click", function () {
          localStorage.removeItem("isLoggedIn");
      });
  }

  checkAuthStatus(); // Verificar al cargar
});



  // Crear un ID basado en el nombre si no existe
  if (!destino.id) {
      destino.id = destino.nombre.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  
  const tagsHTML = destino.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");

  return `
      <div class="destino-card">
          <div class="destino-img">
              <img src="${destino.imagen}" alt="${destino.nombre}">
          </div>
          <div class="destino-content">
              <h3>${destino.nombre}</h3>
              <div class="ubicacion">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${destino.ubicacion}</span>
              </div>
              <div class="rating">
                  ${generarEstrellas(destino.rating)}
                  <span>${destino.rating} (${destino.reviews}+ reseñas)</span>
              </div>
              <p>${destino.descripcion}</p>
              <div class="tags">
                  ${tagsHTML}
              </div>
              <div class="destino-footer">
                  <a href="destino_tarjeta.html?id=${destino.id}">
                      <button class="btn btn-primary">Ver detalles</button>
                  </a>
              </div>
          </div>
      </div>
  `;
}
  
  // Función para generar estrellas según la calificación
  function generarEstrellas(rating) {
    let estrellas = ""
    const ratingEntero = Math.floor(rating)
    const tieneMedia = rating % 1 >= 0.5
  
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingEntero) {
        estrellas += '<i class="fas fa-star"></i>'
      } else if (i === ratingEntero + 1 && tieneMedia) {
        estrellas += '<i class="fas fa-star-half-alt"></i>'
      } else {
        estrellas += '<i class="far fa-star"></i>'
      }
    }
  
    return estrellas
  }
  
  // Función para obtener todas las ubicaciones únicas
  function obtenerUbicaciones() {
    const ubicaciones = new Set()
    ubicaciones.add("todos")
  
    Object.values(destinos).forEach((categoria) => {
      categoria.forEach((destino) => {
        ubicaciones.add(destino.ubicacion)
      })
    })
  
    return Array.from(ubicaciones)
  }
  
  // Función para cargar las opciones de ubicación
  function cargarUbicaciones() {
    const ubicaciones = obtenerUbicaciones()
    const selectUbicacion = document.getElementById("ubicacion")
  
    ubicaciones.forEach((ubicacion) => {
      const option = document.createElement("option")
      option.value = ubicacion === "todos" ? "todos" : ubicacion
      option.textContent = ubicacion === "todos" ? "Todas las ubicaciones" : ubicacion
      selectUbicacion.appendChild(option)
    })
  }
  
  // Función para mostrar todos los destinos al cargar la página
  function cargarTodosLosDestinos() {
    Object.keys(destinos).forEach((categoria) => {
      const gridElement = document.getElementById(`${categoria}Grid`)
      if (gridElement) {
        gridElement.innerHTML = destinos[categoria].map(crearTarjetaDestino).join("")
      }
    })
  
    // Mostrar contador de resultados
    actualizarContadorResultados()
  }
  
  // Función para actualizar el contador de resultados
  function actualizarContadorResultados() {
    const totalDestinos = Object.values(destinos).reduce((total, categoria) => total + categoria.length, 0)
    const contadorElement = document.createElement("div")
    contadorElement.className = "contador-resultados"
    contadorElement.innerHTML = `<p>Mostrando ${totalDestinos} destinos</p>`
  
    const existingContador = document.querySelector(".contador-resultados")
    if (existingContador) {
      existingContador.remove()
    }
  
    document.querySelector(".filtros-container").appendChild(contadorElement)
  }
  
  // Función para filtrar destinos (versión mejorada)
  function filtrarDestinos() {
    const categoria = document.getElementById("categoria").value
    const ubicacion = document.getElementById("ubicacion").value
    const busqueda = document.getElementById("busqueda").value.toLowerCase().trim()
  
    // Mostrar/ocultar secciones según la categoría
    const secciones = document.querySelectorAll(".destinos-section")
    let totalResultados = 0
  
    secciones.forEach((seccion) => {
      const categoriaSeccion = seccion.id
  
      // Si la categoría seleccionada es "todos" o coincide con la sección actual
      if (categoria === "todos" || categoriaSeccion === categoria) {
        seccion.style.display = "block"
  
        // Filtrar destinos de esta categoría
        const destinosFiltrados = destinos[categoriaSeccion].filter((destino) => {
          // Filtro por ubicación
          const coincideUbicacion = ubicacion === "todos" || destino.ubicacion === ubicacion
  
          // Filtro por texto de búsqueda
          const coincideBusqueda =
            busqueda === "" ||
            destino.nombre.toLowerCase().includes(busqueda) ||
            destino.descripcion.toLowerCase().includes(busqueda) ||
            destino.tags.some((tag) => tag.toLowerCase().includes(busqueda))
  
          return coincideUbicacion && coincideBusqueda
        })
  
        // Actualizar el grid con los destinos filtrados
        const gridElement = document.getElementById(`${categoriaSeccion}Grid`)
  
        if (destinosFiltrados.length > 0) {
          gridElement.innerHTML = destinosFiltrados.map(crearTarjetaDestino).join("")
          totalResultados += destinosFiltrados.length
        } else {
          gridElement.innerHTML = `
                      <div class="no-resultados">
                          <p>No se encontraron destinos en esta categoría que coincidan con tu búsqueda.</p>
                      </div>
                  `
        }
      } else {
        seccion.style.display = "none"
      }
    })
  
    // Actualizar contador de resultados
    const contadorElement = document.querySelector(".contador-resultados") || document.createElement("div")
    contadorElement.className = "contador-resultados"
  
    if (totalResultados > 0) {
      contadorElement.innerHTML = `<p>Mostrando ${totalResultados} destinos</p>`
    } else {
      contadorElement.innerHTML = `
              <p>No se encontraron resultados. <button id="resetFiltros" class="btn-reset">Restablecer filtros</button></p>
          `
    }
  
    if (!document.querySelector(".contador-resultados")) {
      document.querySelector(".filtros-container").appendChild(contadorElement)
    }
  
    // Agregar evento al botón de reset si existe
    const resetBtn = document.getElementById("resetFiltros")
    if (resetBtn) {
      resetBtn.addEventListener("click", resetearFiltros)
    }
  }
  
  // Función para resetear todos los filtros
  function resetearFiltros() {
    document.getElementById("categoria").value = "todos"
    document.getElementById("ubicacion").value = "todos"
    document.getElementById("busqueda").value = ""
  
    // Volver a cargar todos los destinos
    cargarTodosLosDestinos()
  
    // Mostrar todas las secciones
    document.querySelectorAll(".destinos-section").forEach((seccion) => {
      seccion.style.display = "block"
    })
  }
  
  // Evento para el menú móvil
  document.getElementById("menuToggle").addEventListener("click", () => {
    const mobileMenu = document.getElementById("mobileMenu")
    mobileMenu.classList.toggle("active")
  })
  
  
  // Inicializar la página
  document.addEventListener("DOMContentLoaded", () => {
    // Cargar las opciones de ubicación
    cargarUbicaciones()
  
    // Cargar todos los destinos
    cargarTodosLosDestinos()
  
    // Agregar eventos a los filtros
    document.getElementById("categoria").addEventListener("change", filtrarDestinos)
    document.getElementById("ubicacion").addEventListener("change", filtrarDestinos)
    document.getElementById("busqueda").addEventListener("input", filtrarDestinos)
    document.querySelector(".btn-buscar").addEventListener("click", filtrarDestinos)
  
    // Establecer el año actual en el footer
    document.getElementById("year").textContent = new Date().getFullYear()

})
  
  