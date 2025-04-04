// Destino Management JavaScript

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando gestión de destinos...');
    
    // Get references to elements
    const addDestinoBtn = document.querySelector('#destinos_seccion .add-btn');
    const destinoTable = document.querySelector('#destinos_seccion .admin-table tbody');
    const modalOverlay = document.getElementById('modal-overlay') || createModalOverlay();
    const destinoModal = document.getElementById('destino-modal') || createDestinoModal();
    
    // Add event listeners
    addDestinoBtn.addEventListener('click', showAddDestinoModal);
    
    // Add event delegation for edit and delete buttons
    destinoTable.addEventListener('click', function(e) {
      const target = e.target.closest('.action-btn');
      if (!target) return;
      
      const row = target.closest('tr');
      const destinoId = row.dataset.id;
      const destinoNombre = row.cells[1].textContent;
      const destinoDescripcion = row.cells[2].textContent;
      const destinoCiudad = row.cells[3].textContent;
      const destinoDireccion = row.cells[4].textContent;
      const destinoCategoriaId = row.dataset.categoriaId;
      
      if (target.classList.contains('edit-btn')) {
        showEditDestinoModal(destinoId, destinoNombre, destinoDescripcion, destinoCiudad, destinoDireccion, destinoCategoriaId);
      } else if (target.classList.contains('delete-btn')) {
        showDeleteConfirmation(destinoId, destinoNombre);
      }
    });
    
    // Initialize the destino form
    initDestinoForm();
    
    // Load destinos from database
    loadDestinos();
    
    // Load categorías for select
    loadCategorias();
  });
  
  // Create modal overlay if it doesn't exist
  function createModalOverlay() {
    console.log('Creando overlay del modal...');
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
    return overlay;
  }
  
  // Create destino modal if it doesn't exist
  function createDestinoModal() {
    console.log('Creando modal de destinos...');
    const modal = document.createElement('div');
    modal.id = 'destino-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modal-title">Añadir Destino</h2>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="destino-form">
            <input type="hidden" id="destino-id">
            <div class="form-group">
              <label for="destino-nombre">Nombre:</label>
              <input type="text" id="destino-nombre" required>
            </div>
            <div class="form-group">
              <label for="destino-descripcion">Descripción:</label>
              <textarea id="destino-descripcion" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label for="destino-ciudad">Ciudad:</label>
              <input type="text" id="destino-ciudad" required>
            </div>
            <div class="form-group">
              <label for="destino-direccion">Dirección:</label>
              <input type="text" id="destino-direccion" required>
            </div>
            <div class="form-group">
              <label for="destino-categoria">Categoría:</label>
              <select id="destino-categoria" required>
                <option value="">Seleccione una categoría</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary cancel-btn">Cancelar</button>
              <button type="submit" class="btn btn-primary save-btn">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }
  
  // Initialize the destino form
  function initDestinoForm() {
    console.log('Inicializando formulario de destinos...');
    const destinoForm = document.getElementById('destino-form');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    
    destinoForm.addEventListener('submit', handleDestinoFormSubmit);
    closeModalBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        hideModal();
      }
    });
  }
  
  // Load destinos from database
  function loadDestinos() {
    console.log('Cargando destinos desde la API...');
    
    fetch('/api/destinos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar destinos');
        }
        return response.json();
      })
      .then(destinos => {
        console.log('Destinos cargados:', destinos);
        
        const destinoTable = document.querySelector('#destinos_seccion .admin-table tbody');
        destinoTable.innerHTML = ''; // Clear existing rows
        
        destinos.forEach(destino => {
          const row = document.createElement('tr');
          row.dataset.id = destino.id_destino;
          row.dataset.categoriaId = destino.id_categoria;
          row.innerHTML = `
            <td>${destino.id_destino}</td>
            <td>${destino.nombre}</td>
            <td>${destino.descripcion || ''}</td>
            <td>${destino.ciudad}</td>
            <td>${destino.direccion}</td>
            <td>${destino.categoria_nombre}</td>
            <td class="actions">
              <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
              <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
            </td>
          `;
          destinoTable.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error al cargar destinos:', error);
        showNotification('Error al cargar destinos: ' + error.message, 'error');
      });
  }
  
  // Load categorías for select
  function loadCategorias() {
    console.log('Cargando categorías para selector...');
    
    fetch('/api/categorias-select')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar categorías');
        }
        return response.json();
      })
      .then(categorias => {
        console.log('Categorías cargadas para selector:', categorias);
        
        const categoriaSelect = document.getElementById('destino-categoria');
        
        // Mantener la opción por defecto
        const defaultOption = categoriaSelect.options[0];
        categoriaSelect.innerHTML = '';
        categoriaSelect.appendChild(defaultOption);
        
        // Añadir las categorías
        categorias.forEach(categoria => {
          const option = document.createElement('option');
          option.value = categoria.id_categoria;
          option.textContent = categoria.nombre;
          categoriaSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al cargar categorías para selector:', error);
        showNotification('Error al cargar categorías: ' + error.message, 'error');
      });
  }
  
  // Show add destino modal
  function showAddDestinoModal() {
    console.log('Mostrando modal para añadir destino...');
    const modalTitle = document.getElementById('modal-title');
    const destinoForm = document.getElementById('destino-form');
    const destinoId = document.getElementById('destino-id');
    const destinoNombre = document.getElementById('destino-nombre');
    const destinoDescripcion = document.getElementById('destino-descripcion');
    const destinoCiudad = document.getElementById('destino-ciudad');
    const destinoDireccion = document.getElementById('destino-direccion');
    const destinoCategoria = document.getElementById('destino-categoria');
    
    modalTitle.textContent = 'Añadir Destino';
    destinoId.value = '';
    destinoNombre.value = '';
    destinoDescripcion.value = '';
    destinoCiudad.value = '';
    destinoDireccion.value = '';
    destinoCategoria.value = '';
    
    showModal();
  }
  
  // Show edit destino modal
  function showEditDestinoModal(id, nombre, descripcion, ciudad, direccion, categoriaId) {
    console.log('Mostrando modal para editar destino:', id);
    const modalTitle = document.getElementById('modal-title');
    const destinoId = document.getElementById('destino-id');
    const destinoNombre = document.getElementById('destino-nombre');
    const destinoDescripcion = document.getElementById('destino-descripcion');
    const destinoCiudad = document.getElementById('destino-ciudad');
    const destinoDireccion = document.getElementById('destino-direccion');
    const destinoCategoria = document.getElementById('destino-categoria');
    
    modalTitle.textContent = 'Editar Destino';
    destinoId.value = id;
    destinoNombre.value = nombre;
    destinoDescripcion.value = descripcion;
    destinoCiudad.value = ciudad;
    destinoDireccion.value = direccion;
    destinoCategoria.value = categoriaId;
    
    showModal();
  }
  
  // Show delete confirmation
  function showDeleteConfirmation(id, nombre) {
    console.log('Solicitando confirmación para eliminar destino:', id);
    if (confirm(`¿Estás seguro de que deseas eliminar el destino "${nombre}"?`)) {
      deleteDestino(id);
    }
  }
  
  // Handle destino form submit
  function handleDestinoFormSubmit(e) {
    e.preventDefault();
    
    const destinoId = document.getElementById('destino-id').value;
    const destinoNombre = document.getElementById('destino-nombre').value;
    const destinoDescripcion = document.getElementById('destino-descripcion').value;
    const destinoCiudad = document.getElementById('destino-ciudad').value;
    const destinoDireccion = document.getElementById('destino-direccion').value;
    const destinoCategoria = document.getElementById('destino-categoria').value;
    
    if (!destinoNombre || !destinoCiudad || !destinoDireccion || !destinoCategoria) {
      showNotification('Los campos nombre, ciudad, dirección y categoría son obligatorios', 'error');
      return;
    }
    
    console.log('Enviando formulario de destino:', { 
      id: destinoId || 'nuevo', 
      nombre: destinoNombre, 
      descripcion: destinoDescripcion,
      ciudad: destinoCiudad,
      direccion: destinoDireccion,
      id_categoria: destinoCategoria
    });
    
    if (destinoId) {
      updateDestino(destinoId, destinoNombre, destinoDescripcion, destinoCiudad, destinoDireccion, destinoCategoria);
    } else {
      addDestino(destinoNombre, destinoDescripcion, destinoCiudad, destinoDireccion, destinoCategoria);
    }
  }
  
  // Add a new destino
  function addDestino(nombre, descripcion, ciudad, direccion, id_categoria) {
    console.log('Añadiendo nuevo destino:', { nombre, descripcion, ciudad, direccion, id_categoria });
    
    // Crear objeto con los datos del destino
    const destinoData = {
      nombre,
      descripcion,
      ciudad,
      direccion,
      id_categoria
    };
    
    // Enviar solicitud al servidor
    fetch('/api/destinos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(destinoData)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Error al crear el destino');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Destino añadido correctamente:', data);
      
      // Ocultar el modal
      hideModal();
      
      // Recargar los destinos para mostrar el nuevo
      loadDestinos();
      
      // Mostrar notificación de éxito
      showNotification('Destino añadido correctamente', 'success');
    })
    .catch(error => {
      console.error('Error al añadir destino:', error);
      showNotification(error.message, 'error');
    });
  }
  
  // Update an existing destino
  function updateDestino(id, nombre, descripcion, ciudad, direccion, id_categoria) {
    console.log('Actualizando destino:', { id, nombre, descripcion, ciudad, direccion, id_categoria });
    
    // Crear objeto con los datos del destino
    const destinoData = {
      nombre,
      descripcion,
      ciudad,
      direccion,
      id_categoria
    };
    
    // Enviar solicitud al servidor
    fetch(`/api/destinos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(destinoData)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Error al actualizar el destino');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Destino actualizado correctamente:', data);
      
      // Ocultar el modal
      hideModal();
      
      // Recargar los destinos para mostrar los cambios
      loadDestinos();
      
      // Mostrar notificación de éxito
      showNotification('Destino actualizado correctamente', 'success');
    })
    .catch(error => {
      console.error('Error al actualizar destino:', error);
      showNotification(error.message, 'error');
    });
  }
  
  // Delete a destino
  function deleteDestino(id) {
    console.log('Eliminando destino:', id);
    
    // Enviar solicitud al servidor
    fetch(`/api/destinos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Error al eliminar el destino');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Destino eliminado correctamente:', data);
      
      // Recargar los destinos para reflejar la eliminación
      loadDestinos();
      
      // Mostrar notificación de éxito
      showNotification('Destino eliminado correctamente', 'success');
    })
    .catch(error => {
      console.error('Error al eliminar destino:', error);
      showNotification(error.message, 'error');
    });
  }
  
  // Show the modal
  function showModal() {
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById('destino-modal').classList.add('active');
    document.body.classList.add('modal-open');
  }
  
  // Hide the modal
  function hideModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById('destino-modal').classList.remove('active');
    document.body.classList.remove('modal-open');
  }
  
  // Show notification
  function showNotification(message, type = 'info') {
    console.log(`Notificación (${type}):`, message);
    
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'notification';
      notification.className = 'notification';
      document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('active');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('active');
    }, 3000);
  }
  
  