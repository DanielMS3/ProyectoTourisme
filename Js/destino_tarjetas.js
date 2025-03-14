// Datos de los destinos (copia del archivo original)
const destinos = {
  parques: [
    {
      id: "parque-arvi",
      nombre: "Parque Arví",
      ubicacion: "Medellín",
      descripcion: "Ideal para senderismo, avistamiento de aves y picnic. Se puede llegar en metro y metrocable. El Parque Arví es una reserva natural de 16.000 hectáreas ubicada en la zona rural de Medellín. Cuenta con senderos ecológicos, miradores, lagos y zonas para picnic. Es un lugar perfecto para conectar con la naturaleza, hacer senderismo y disfrutar del aire puro. Además, ofrece actividades como avistamiento de aves, recorridos guiados y mercado campesino los fines de semana.",
      imagen: "img/parque_arvi.jpeg",
      rating: 4.8,
      reviews: 120,
      tags: ["Senderismo", "Naturaleza", "Picnic", "Avistamiento de aves", "Metrocable"],
      categoria: "parques"
    },
    {
      id: "cerro-volador",
      nombre: "Cerro El Volador",
      ubicacion: "Medellín",
      descripcion: "Uno de los cerros tutelares con miradores y senderos ecológicos. El Cerro El Volador es uno de los siete cerros tutelares de Medellín y fue declarado Parque Natural Nacional en 1992. Con una altura de 1.628 metros sobre el nivel del mar, ofrece una vista panorámica de la ciudad. Es un espacio ideal para hacer ejercicio, caminar por sus senderos y disfrutar de la naturaleza en medio de la ciudad. También es un importante sitio arqueológico con vestigios de asentamientos prehispánicos.",
      imagen: "https://via.placeholder.com/800x500?text=Cerro+El+Volador",
      rating: 4.5,
      reviews: 95,
      tags: ["Senderismo", "Mirador", "Deportes", "Arqueología", "Historia"],
      categoria: "parques"
    },
    {
      id: "piedras-blancas",
      nombre: "Parque Ecológico Piedras Blancas",
      ubicacion: "Santa Elena",
      descripcion: "Un bosque con lagos, senderos y el Mariposario de Comfama. El Parque Ecológico Piedras Blancas está ubicado en el corregimiento de Santa Elena, a solo 30 minutos de Medellín. Este hermoso espacio natural cuenta con un embalse, bosques nativos, senderos ecológicos y el famoso Mariposario Piedras Blancas. Los visitantes pueden disfrutar de actividades como paseos en bote, caminatas, observación de flora y fauna, y visitas guiadas. Es un destino ideal para familias y amantes de la naturaleza.",
      imagen: "https://via.placeholder.com/800x500?text=Piedras+Blancas",
      rating: 4.7,
      reviews: 110,
      tags: ["Lagos", "Mariposario", "Naturaleza", "Senderismo", "Paseos en bote"],
      categoria: "parques"
    },
    {
      id: "la-romera",
      nombre: "Ecoparque La Romera",
      ubicacion: "Sabaneta",
      descripcion: "Reserva natural con biodiversidad y senderos ecológicos. El Ecoparque La Romera es una reserva natural ubicada en Sabaneta, a pocos kilómetros de Medellín. Con más de 180 hectáreas de bosque, este parque es hogar de una gran biodiversidad, incluyendo más de 70 especies de aves y mamíferos como monos aulladores. Cuenta con senderos ecológicos, cascadas, quebradas y miradores con vistas panorámicas del Valle de Aburrá. Es un lugar perfecto para el senderismo, la observación de fauna y la conexión con la naturaleza.",
      imagen: "https://via.placeholder.com/800x500?text=La+Romera",
      rating: 4.6,
      reviews: 85,
      tags: ["Reserva", "Biodiversidad", "Senderismo", "Cascadas", "Fauna"],
      categoria: "parques"
    },
    {
      id: "salto-angel",
      nombre: "Cascada Salto del Ángel",
      ubicacion: "Envigado",
      descripcion: "Una hermosa cascada escondida en las montañas de Envigado. La Cascada Salto del Ángel es una joya natural escondida en las montañas de Envigado. Con una caída de agua de aproximadamente 20 metros, esta cascada ofrece un espectáculo natural impresionante. Para llegar a ella, se debe realizar una caminata de dificultad media a través de senderos rodeados de vegetación exuberante. El recorrido permite disfrutar de la biodiversidad de la zona y culmina con la refrescante vista de la cascada, donde los visitantes pueden tomar un baño en sus aguas cristalinas.",
      imagen: "https://via.placeholder.com/800x500?text=Salto+del+Angel",
      rating: 4.9,
      reviews: 75,
      tags: ["Cascada", "Naturaleza", "Aventura", "Senderismo", "Baño natural"],
      categoria: "parques"
    }
  ],
  miradores: [
    {
      id: "mirador-palmas",
      nombre: "Mirador Las Palmas",
      ubicacion: "Medellín",
      descripcion: "Vista panorámica de la ciudad, ideal para ir de noche. El Mirador Las Palmas es uno de los puntos más populares para contemplar la ciudad de Medellín desde las alturas. Ubicado en la vía Las Palmas, ofrece una vista panorámica impresionante de todo el Valle de Aburrá, especialmente hermosa durante el atardecer y la noche, cuando las luces de la ciudad crean un espectáculo visual único. El mirador cuenta con varios restaurantes y cafés donde los visitantes pueden disfrutar de la gastronomía local mientras contemplan la vista. Es un lugar muy romántico y perfecto para tomar fotografías memorables.",
      imagen: "https://via.placeholder.com/800x500?text=Mirador+Las+Palmas",
      rating: 4.9,
      reviews: 150,
      tags: ["Panorámica", "Nocturno", "Romántico", "Fotografía", "Gastronomía"],
      categoria: "miradores"
    },
    {
      id: "san-felix",
      nombre: "Mirador San Félix",
      ubicacion: "Bello",
      descripcion: "Conocido por los vuelos en parapente y una vista espectacular. El Mirador San Félix, ubicado en el municipio de Bello, es famoso por ser uno de los mejores lugares para practicar parapente en Colombia. Desde una altura de aproximadamente 2.000 metros sobre el nivel del mar, ofrece una vista panorámica impresionante del Valle de Aburrá. Los visitantes pueden disfrutar observando los despegues de parapentes o atreverse a volar en compañía de instructores profesionales. Además de la adrenalina del parapente, el mirador cuenta con zonas para picnic, pequeños restaurantes y senderos para caminatas cortas.",
      imagen: "https://via.placeholder.com/800x500?text=Mirador+San+Felix",
      rating: 4.8,
      reviews: 130,
      tags: ["Parapente", "Vista", "Aventura", "Deportes extremos", "Fotografía"],
      categoria: "miradores"
    },
    {
      id: "mirador-sabaneta",
      nombre: "Mirador de Sabaneta",
      ubicacion: "Sabaneta",
      descripcion: "Un lugar tranquilo para ver la ciudad desde las alturas. El Mirador de Sabaneta es un espacio tranquilo y familiar ubicado en las alturas de este municipio del sur del Valle de Aburrá. Ofrece una vista panorámica de la zona metropolitana en un ambiente más relajado y menos concurrido que otros miradores. El lugar cuenta con zonas verdes, juegos infantiles y pequeños establecimientos donde se pueden degustar platos típicos como las obleas, buñuelos y empanadas. Es ideal para visitas familiares y para quienes buscan un espacio tranquilo para contemplar el paisaje urbano y montañoso.",
      imagen: "https://via.placeholder.com/800x500?text=Mirador+Sabaneta",
      rating: 4.6,
      reviews: 90,
      tags: ["Tranquilo", "Vista", "Familiar", "Gastronomía", "Relajación"],
      categoria: "miradores"
    },
    {
      id: "mirador-cielo",
      nombre: "Mirador del Cielo",
      ubicacion: "Medellín",
      descripcion: "Un lugar atractivo que ofrece vistas panorámicas de la ciudad. El Mirador del Cielo es uno de los puntos más elevados de Medellín, ofreciendo una perspectiva única de la ciudad y sus alrededores. Ubicado en la zona nororiental, este mirador permite contemplar el contraste entre el paisaje urbano y las montañas que rodean el Valle de Aburrá. El lugar es especialmente popular entre fotógrafos por las oportunidades que ofrece para capturar imágenes espectaculares, particularmente durante el amanecer y el atardecer. Cuenta con áreas de descanso y pequeños puestos de venta de alimentos y bebidas típicas.",
      imagen: "https://via.placeholder.com/800x500?text=Mirador+del+Cielo",
      rating: 4.7,
      reviews: 85,
      tags: ["Panorámica", "Fotografía", "Turístico", "Amanecer", "Atardecer"],
      categoria: "miradores"
    },
    {
      id: "cerro-quitasol",
      nombre: "Cerro Quitasol",
      ubicacion: "Bello",
      descripcion: "Desde aquí podrá ver una panorámica del municipio siendo el mirador principal. El Cerro Quitasol es uno de los cerros tutelares más importantes del Valle de Aburrá, ubicado en el municipio de Bello. Con una altura de 2.880 metros sobre el nivel del mar, ofrece una vista panorámica excepcional de todo el valle. El ascenso al cerro es una experiencia de senderismo de dificultad media que toma aproximadamente 3 horas. Durante el recorrido, los visitantes pueden apreciar la rica biodiversidad de la zona y descubrir vestigios arqueológicos de asentamientos indígenas. En la cima, además de la impresionante vista, se encuentra una cruz que se ha convertido en símbolo del municipio.",
      imagen: "https://via.placeholder.com/800x500?text=Cerro+Quitasol",
      rating: 4.5,
      reviews: 75,
      tags: ["Senderismo", "Panorámica", "Naturaleza", "Arqueología", "Historia"],
      categoria: "miradores"
    }
  ],
  museos: [
    {
      id: "museo-antioquia",
      nombre: "Museo de Antioquia y Plaza Botero",
      ubicacion: "Medellín",
      descripcion: "Exhibe obras de Fernando Botero y tiene una gran colección de arte. El Museo de Antioquia, fundado en 1881, es uno de los museos más importantes de Colombia y el más antiguo de Antioquia. Ubicado en el centro histórico de Medellín, alberga una extensa colección de obras de arte, incluyendo una significativa muestra de trabajos del reconocido artista colombiano Fernando Botero. Frente al museo se encuentra la Plaza Botero, un espacio público que exhibe 23 esculturas monumentales donadas por el artista a la ciudad. Este conjunto cultural es uno de los principales atractivos turísticos de Medellín y un importante centro de la vida cultural de la ciudad.",
      imagen: "https://via.placeholder.com/800x500?text=Museo+Antioquia",
      rating: 4.9,
      reviews: 200,
      tags: ["Arte", "Botero", "Cultural", "Historia", "Esculturas"],
      categoria: "museos"
    },
    {
      id: "casa-memoria",
      nombre: "Casa de la Memoria",
      ubicacion: "Medellín",
      descripcion: "Un museo sobre la historia del conflicto en Colombia. La Casa de la Memoria es un museo y centro cultural dedicado a la reconstrucción, visibilización y comprensión de las memorias del conflicto armado en Colombia, con énfasis en Medellín y Antioquia. A través de exposiciones, archivos, investigaciones y actividades educativas, este espacio busca dignificar a las víctimas, promover el diálogo y contribuir a la transformación de las lógicas de la guerra hacia prácticas más civilizadas. El edificio, de arquitectura contemporánea, alberga salas de exposición, un centro de documentación, auditorio y espacios para talleres y encuentros comunitarios.",
      imagen: "https://via.placeholder.com/800x500?text=Casa+Memoria",
      rating: 4.8,
      reviews: 150,
      tags: ["Historia", "Conflicto", "Educativo", "Memoria", "Paz"],
      categoria: "museos"
    },
    {
      id: "pueblito-paisa",
      nombre: "Pueblito Paisa",
      ubicacion: "Medellín",
      descripcion: "Una réplica de un pueblo tradicional con una vista panorámica de la ciudad. El Pueblito Paisa es una réplica a escala de un típico pueblo antioqueño de principios del siglo XX, ubicado en la cima del Cerro Nutibara en Medellín. Este pintoresco conjunto incluye una plaza central con una fuente, una iglesia, la alcaldía, la barbería, la escuela y otras construcciones tradicionales, todas fielmente recreadas con materiales y técnicas de la época. Además de ser un atractivo cultural que permite a los visitantes conocer la arquitectura y costumbres tradicionales de la región, el Pueblito Paisa ofrece una vista panorámica espectacular de la ciudad de Medellín desde sus 80 metros de altura.",
      imagen: "https://via.placeholder.com/800x500?text=Pueblito+Paisa",
      rating: 4.7,
      reviews: 180,
      tags: ["Tradicional", "Panorámica", "Cultural", "Arquitectura", "Historia"],
      categoria: "museos"
    },
    {
      id: "catedral-basilica",
      nombre: "Catedral Basílica Metropolitana",
      ubicacion: "Medellín",
      descripcion: "Una de las iglesias de ladrillo más grandes del mundo. La Catedral Basílica Metropolitana de Medellín, también conocida como Catedral de Villanueva, es la iglesia principal de la Arquidiócesis de Medellín y uno de los edificios religiosos más importantes de Colombia. Construida entre 1875 y 1931, es considerada una de las iglesias de ladrillo más grandes del mundo, con una longitud de 108 metros, un ancho de 45 metros y torres que alcanzan los 69 metros de altura. Su estilo arquitectónico es románico y cuenta con elementos neorrománicos. En su interior alberga valiosas obras de arte religioso, incluyendo un órgano monumental y vitrales importados de Europa.",
      imagen: "https://via.placeholder.com/800x500?text=Catedral+Basilica",
      rating: 4.6,
      reviews: 120,
      tags: ["Religioso", "Arquitectura", "Histórico", "Arte", "Patrimonio"],
      categoria: "museos"
    },
    {
      id: "cementerio-san-pedro",
      nombre: "Cementerio Museo San Pedro",
      ubicacion: "Medellín",
      descripcion: "Un lugar con valor histórico y cultural. El Cementerio Museo San Pedro, fundado en 1842, es uno de los primeros cementerios de carácter civil en Medellín y fue declarado Museo en 1998 y Bien de Interés Cultural de la Nación en 1999. Este espacio combina el valor patrimonial de un cementerio histórico con la dinámica cultural de un museo. Alberga mausoleos y esculturas funerarias de gran valor artístico, muchas de ellas creadas por reconocidos escultores nacionales e internacionales. El museo realiza regularmente exposiciones, conciertos, visitas guiadas y otras actividades culturales que permiten a los visitantes apreciar la historia, el arte y las tradiciones funerarias de la región.",
      imagen: "https://via.placeholder.com/800x500?text=Cementerio+San+Pedro",
      rating: 4.5,
      reviews: 90,
      tags: ["Histórico", "Cultural", "Arquitectura", "Arte", "Patrimonio"],
      categoria: "museos"
    }
  ],
  actividades: [
    {
      id: "parapente-san-felix",
      nombre: "Parapente en San Félix",
      ubicacion: "Bello",
      descripcion: "Una de las mejores experiencias para volar sobre el Valle de Aburrá. El parapente en San Félix es una de las actividades de aventura más populares en Medellín. Desde este punto, ubicado en el municipio de Bello a unos 2.000 metros sobre el nivel del mar, los visitantes pueden disfrutar de vuelos tándem con instructores certificados que ofrecen una experiencia segura y emocionante. Durante el vuelo, que dura aproximadamente 20 minutos, se puede apreciar una vista panorámica espectacular de todo el Valle de Aburrá. No se requiere experiencia previa, y la actividad incluye todo el equipo necesario y una breve capacitación antes del despegue.",
      imagen: "https://via.placeholder.com/800x500?text=Parapente+San+Felix",
      rating: 4.9,
      reviews: 200,
      tags: ["Aventura", "Vuelo", "Adrenalina", "Vistas", "Deporte extremo"],
      categoria: "actividades"
    },
    {
      id: "ciclovia-medellin",
      nombre: "Ciclovía Medellín",
      ubicacion: "Medellín",
      descripcion: "Los domingos, la ciudad abre varias calles para ciclistas y deportistas. La Ciclovía de Medellín es un programa recreativo que se realiza todos los domingos y días festivos de 7:00 am a 1:00 pm. Durante este tiempo, importantes avenidas de la ciudad se cierran al tráfico vehicular y se abren exclusivamente para actividades recreativas como ciclismo, patinaje, running y caminatas. El recorrido principal abarca aproximadamente 42 kilómetros por las principales vías de la ciudad. A lo largo del trayecto se instalan puntos de hidratación, asistencia mecánica para bicicletas y servicios de primeros auxilios. Es una excelente oportunidad para disfrutar de la ciudad de una manera diferente y saludable.",
      imagen: "https://via.placeholder.com/800x500?text=Ciclovia+Medellin",
      rating: 4.7,
      reviews: 150,
      tags: ["Deporte", "Bicicleta", "Domingos", "Recreación", "Vida saludable"],
      categoria: "actividades"
    },
    {
      id: "senderismo-tres-cruces",
      nombre: "Senderismo en el Cerro de las Tres Cruces",
      ubicacion: "Medellín",
      descripcion: "Un buen reto con vista increíble. El Cerro de las Tres Cruces es uno de los destinos favoritos para los amantes del senderismo y el ejercicio al aire libre en Medellín. Con una altura de 1.657 metros sobre el nivel del mar, ofrece un recorrido desafiante pero accesible para personas con condición física moderada. La ruta principal tiene aproximadamente 2.5 kilómetros de ascenso y toma entre 45 minutos y 1 hora completarla. En la cima se encuentran las tres cruces que dan nombre al lugar y una vista panorámica espectacular de la ciudad. El cerro es muy popular entre los deportistas locales, especialmente en las primeras horas de la mañana.",
      imagen: "https://via.placeholder.com/800x500?text=Senderismo+Tres+Cruces",
      rating: 4.8,
      reviews: 130,
      tags: ["Senderismo", "Deporte", "Vista", "Ejercicio", "Naturaleza"],
      categoria: "actividades"
    },
    {
      id: "tequendamita",
      nombre: "Salto del Tequendamita",
      ubicacion: "El Retiro",
      descripcion: "Una cascada impresionante ideal para el senderismo. El Salto del Tequendamita es una hermosa cascada ubicada en el municipio de El Retiro, a unos 40 minutos de Medellín. Con una caída de agua de aproximadamente 15 metros, este salto forma pozos naturales de agua cristalina perfectos para refrescarse. Para llegar a la cascada, se debe realizar una caminata de dificultad baja a media a través de senderos rodeados de vegetación nativa. El recorrido completo toma alrededor de 2 horas ida y vuelta. Es recomendable visitar el lugar con un guía local que conozca bien la zona. El área cuenta con espacios para picnic y descanso, lo que lo convierte en un destino ideal para pasar un día en contacto con la naturaleza.",
      imagen: "https://via.placeholder.com/800x500?text=Tequendamita",
      rating: 4.6,
      reviews: 85,
      tags: ["Cascada", "Senderismo", "Naturaleza", "Baño natural", "Picnic"],
      categoria: "actividades"
    },
    {
      id: "patinaje-aeroparque",
      nombre: "Patinaje en el Aeroparque Juan Pablo II",
      ubicacion: "Medellín",
      descripcion: "Pistas adecuadas para patinadores y actividades deportivas. El Aeroparque Juan Pablo II es un complejo deportivo y recreativo ubicado en el occidente de Medellín. Cuenta con una de las mejores pistas de patinaje de la ciudad, diseñada tanto para principiantes como para patinadores experimentados. Además de la pista principal, el parque ofrece espacios para múltiples actividades deportivas como fútbol, baloncesto, voleibol y tenis. También dispone de zonas verdes, juegos infantiles y áreas de picnic. El aeroparque es especialmente popular los fines de semana, cuando familias enteras acuden a disfrutar de sus instalaciones en un ambiente seguro y familiar.",
      imagen: "https://via.placeholder.com/800x500?text=Aeroparque",
      rating: 4.5,
      reviews: 90,
      tags: ["Patinaje", "Deporte", "Recreación", "Familiar", "Parque"],
      categoria: "actividades"
    }
  ],
  plazas: [
    {
      id: "comuna-13",
      nombre: "Comuna 13",
      ubicacion: "Medellín",
      descripcion: "Un recorrido lleno de arte urbano, música y cultura. La Comuna 13, anteriormente uno de los barrios más peligrosos de Medellín, se ha transformado en un símbolo de resiliencia y renovación urbana. Hoy es un destino turístico imprescindible, famoso por sus coloridos murales de grafiti, escaleras eléctricas al aire libre (las primeras en un asentamiento informal en el mundo) y su vibrante escena cultural. Los recorridos guiados por la comuna permiten a los visitantes conocer la historia de transformación del barrio, apreciar el arte urbano creado por artistas locales y disfrutar de presentaciones de hip-hop y breakdance. También hay numerosos cafés, tiendas de souvenirs y miradores con vistas panorámicas de la ciudad.",
      imagen: "https://via.placeholder.com/800x500?text=Comuna+13",
      rating: 4.9,
      reviews: 250,
      tags: ["Arte urbano", "Cultural", "Turístico", "Historia", "Transformación"],
      categoria: "plazas"
    },
    {
      id: "acuaparque-ditaires",
      nombre: "Acuaparque Ditaires",
      ubicacion: "Itagüí",
      descripcion: "Parque acuático con piscinas y toboganes. El Acuaparque Ditaires es un complejo recreativo ubicado en el municipio de Itagüí, al sur del Valle de Aburrá. Este parque acuático cuenta con varias piscinas para todas las edades, toboganes, juegos interactivos de agua y amplias zonas verdes. Además de las atracciones acuáticas, el complejo incluye canchas deportivas, senderos para caminatas, zonas de picnic y un lago artificial. El parque está rodeado de abundante vegetación, lo que crea un ambiente fresco y natural. Es un destino muy popular entre familias, especialmente durante los fines de semana y temporadas de vacaciones.",
      imagen: "https://via.placeholder.com/800x500?text=Acuaparque+Ditaires",
      rating: 4.6,
      reviews: 180,
      tags: ["Acuático", "Familiar", "Recreación", "Piscinas", "Toboganes"],
      categoria: "plazas"
    },
    {
      id: "pies-descalzos",
      nombre: "Parque de los Pies Descalzos",
      ubicacion: "Medellín",
      descripcion: "Un espacio interactivo con fuentes y jardines zen. El Parque de los Pies Descalzos es un innovador espacio público ubicado en el centro de Medellín, junto al edificio de las Empresas Públicas de Medellín. Diseñado como un lugar para la estimulación sensorial y la relajación, el parque invita a los visitantes a quitarse los zapatos y caminar descalzos por diferentes superficies como arena, piedra y agua. Cuenta con un bosque de bambú, fuentes interactivas, un jardín zen y espacios para la meditación. Este parque representa la filosofía de la 'arquitectura para los sentidos' y ofrece un oasis de tranquilidad en medio del bullicio urbano. Es particularmente refrescante durante los días calurosos.",
      imagen: "https://via.placeholder.com/800x500?text=Pies+Descalzos",
      rating: 4.7,
      reviews: 160,
      tags: ["Interactivo", "Zen", "Relajación", "Sensorial", "Agua"],
      categoria: "plazas"
    },
    {
      id: "explora-planetario",
      nombre: "Explora Parque y Planetario",
      ubicacion: "Medellín",
      descripcion: "Ciencia, tecnología y astronomía en un solo lugar. El Parque Explora es un museo interactivo de ciencia y tecnología ubicado en el norte de Medellín. Con más de 300 experiencias interactivas distribuidas en varias salas temáticas, ofrece a visitantes de todas las edades la oportunidad de aprender sobre física, biología, tecnología y medio ambiente de manera divertida y participativa. El complejo incluye el Acuario más grande de Sudamérica, con especies de los ríos y mares de Colombia, y el Planetario de Medellín, donde se realizan proyecciones astronómicas inmersivas y se desarrollan actividades relacionadas con la astronomía. El Parque Explora es un referente de la transformación educativa y cultural de Medellín.",
      imagen: "https://via.placeholder.com/800x500?text=Explora+Planetario",
      rating: 4.8,
      reviews: 200,
      tags: ["Ciencia", "Educativo", "Familiar", "Interactivo", "Astronomía"],
      categoria: "plazas"
    },
    {
      id: "jardin-botanico",
      nombre: "Jardín Botánico de Medellín",
      ubicacion: "Medellín",
      descripcion: "Un pulmón verde en la ciudad con mariposario y lagunas. El Jardín Botánico de Medellín Joaquín Antonio Uribe es un oasis natural de 14 hectáreas ubicado en el corazón de la ciudad. Alberga más de 4.500 flores y 139 especies de aves, siendo un importante centro de investigación y conservación de la biodiversidad. Entre sus principales atracciones se encuentran el Orquideorama, una impresionante estructura arquitectónica que semeja un conjunto de flores; el Mariposario, hogar de numerosas especies de mariposas; y el Herbario, que conserva una colección de más de 10.000 ejemplares de plantas. El jardín también cuenta con lagos, senderos ecológicos, restaurantes y espacios para eventos culturales y educativos.",
      imagen: "https://via.placeholder.com/800x500?text=Jardin+Botanico",
      rating: 4.9,
      reviews: 220,
      tags: ["Naturaleza", "Mariposario", "Urbano", "Biodiversidad", "Educativo"],
      categoria: "plazas"
    }
  ]
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

// Función para cargar los detalles del destino
function cargarDetallesDestino() {
  const { id } = obtenerParametrosURL();
  
  if (!id) {
      // Si no hay ID, redirigir a la página principal
      window.location.href = 'index.html';
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
  document.getElementById('destino-img').src = destino.imagen;
  document.getElementById('destino-img').alt = destino.nombre;
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
  
  // Cargar destinos relacionados
  cargarDestinosRelacionados(destino);
}

// Función para cargar destinos relacionados
function cargarDestinosRelacionados(destinoActual) {
  const destinosRelacionadosGrid = document.getElementById('destinos-relacionados-grid');
  destinosRelacionadosGrid.innerHTML = '';
  
  // Obtener destinos de la misma categoría
  const destinosRelacionados = destinos[destinoActual.categoria]
      .filter(destino => destino.id !== destinoActual.id)
      .slice(0, 3); // Mostrar solo 3 destinos relacionados
  
  if (destinosRelacionados.length === 0) {
      const mensaje = document.createElement('p');
      mensaje.textContent = 'No hay destinos relacionados disponibles.';
      mensaje.style.textAlign = 'center';
      mensaje.style.gridColumn = '1 / -1';
      destinosRelacionadosGrid.appendChild(mensaje);
      return;
  }
  
  // Crear tarjetas para los destinos relacionados
  destinosRelacionados.forEach(destino => {
      const tagsHTML = destino.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join("");
      
      const destinoCard = document.createElement('div');
      destinoCard.className = 'destino-card';
      destinoCard.innerHTML = `
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
              <p>${destino.descripcion.substring(0, 100)}...</p>
              <div class="tags">
                  ${tagsHTML}
              </div>
              <div class="destino-footer">
                  <a href="destino.html?id=${destino.id}">
                      <button class="btn btn-primary">Ver detalles</button>
                  </a>
              </div>
          </div>
      `;
      
      destinosRelacionadosGrid.appendChild(destinoCard);
  });
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
  
  // Establecer el año actual en el footer
  document.getElementById("year").textContent = new Date().getFullYear();
});