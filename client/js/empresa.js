// Empresas Management JavaScript

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando gestión de empresas...');
    
    // Get references to elements
    const addEmpresaBtn = document.querySelector('#empresas_seccion .add-btn');
    const empresaTable = document.querySelector('#empresas_seccion .admin-table tbody');
    const modalOverlay = document.getElementById('modal-overlay') || createModalOverlay();
    const empresaModal = document.getElementById('empresa-modal') || createEmpresaModal();
    
    // Add event listeners
    if (addEmpresaBtn) {
      addEmpresaBtn.addEventListener('click', showAddEmpresaModal);
    } else {
      console.error('No se encontró el botón de añadir empresa');
    }
    
    // Add event delegation for edit and delete buttons
    if (empresaTable) {
      empresaTable.addEventListener('click', function(e) {
        const target = e.target.closest('.action-btn');
        if (!target) return;
        
        const row = target.closest('tr');
        const empresaId = row.dataset.id;
        const empresaNombre = row.cells[1].textContent;
        const empresaDescripcion = row.cells[2].textContent;
        const empresaTipo = row.cells[3].textContent;
        const empresaHorarioApertura = row.dataset.horarioApertura;
        const empresaHorarioCierre = row.dataset.horarioCierre;
        const empresaTelefono = row.cells[6].textContent;
        const empresaUsuarioId = row.dataset.usuarioId;
        const empresaDestinoId = row.dataset.destinoId;
        
        if (target.classList.contains('edit-btn')) {
          showEditEmpresaModal(
            empresaId, 
            empresaNombre, 
            empresaDescripcion, 
            empresaTipo, 
            empresaHorarioApertura, 
            empresaHorarioCierre, 
            empresaTelefono, 
            empresaUsuarioId, 
            empresaDestinoId
          );
        } else if (target.classList.contains('delete-btn')) {
          showDeleteConfirmation(empresaId, empresaNombre);
        }
      });
    } else {
      console.error('No se encontró la tabla de empresas');
    }
    
    // Initialize the empresa form
    initEmpresaForm();
    
    // Load empresas from database
    loadEmpresas();
    
    // Load usuarios and destinos for selects
    loadUsuarios();
    loadDestinos();
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
  
  // Create empresa modal if it doesn't exist
  function createEmpresaModal() {
    console.log('Creando modal de empresas...');
    const modal = document.createElement('div');
    modal.id = 'empresa-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modal-title">Añadir Empresa</h2>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="empresa-form">
            <input type="hidden" id="empresa-id">
            <div class="form-group">
              <label for="empresa-nombre">Nombre:</label>
              <input type="text" id="empresa-nombre" required>
            </div>
            <div class="form-group">
              <label for="empresa-descripcion">Descripción:</label>
              <textarea id="empresa-descripcion" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label for="empresa-tipo">Tipo:</label>
              <select id="empresa-tipo" required>
                <option value="">Seleccione un tipo</option>
                <option value="Restaurante">Restaurante</option>
                <option value="Atracción">Atracción</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="form-group">
              <label for="empresa-horario-apertura">Horario de apertura:</label>
              <input type="time" id="empresa-horario-apertura">
            </div>
            <div class="form-group">
              <label for="empresa-horario-cierre">Horario de cierre:</label>
              <input type="time" id="empresa-horario-cierre">
            </div>
            <div class="form-group">
              <label for="empresa-telefono">Teléfono:</label>
              <input type="tel" id="empresa-telefono">
            </div>
            <div class="form-group">
              <label for="empresa-usuario">Usuario:</label>
              <select id="empresa-usuario" required>
                <option value="">Seleccione un usuario</option>
              </select>
            </div>
            <div class="form-group">
              <label for="empresa-destino">Destino:</label>
              <select id="empresa-destino" required>
                <option value="">Seleccione un destino</option>
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
  
  // Initialize the empresa form
  function initEmpresaForm() {
    console.log('Inicializando formulario de empresas...');
    const empresaForm = document.getElementById('empresa-form');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (empresaForm) {
      empresaForm.addEventListener('submit', handleEmpresaFormSubmit);
    } else {
      console.error('No se encontró el formulario de empresas');
    }
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', hideModal);
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', hideModal);
    }
    
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
          hideModal();
        }
      });
    }
  }
  
  // Load empresas from database
  function loadEmpresas() {
    console.log('Cargando empresas desde la API...');
    
    fetch('/api/empresas')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar empresas');
        }
        return response.json();
      })
      .then(empresas => {
        console.log('Empresas cargadas:', empresas);
        
        const empresaTable = document.querySelector('#empresas_seccion .admin-table tbody');
        if (!empresaTable) {
          console.error('No se encontró la tabla de empresas para cargar los datos');
          return;
        }
        
        empresaTable.innerHTML = ''; // Clear existing rows
        
        empresas.forEach(empresa => {
          const row = document.createElement('tr');
          row.dataset.id = empresa.id_empresa;
          row.dataset.usuarioId = empresa.id_usuario;
          row.dataset.destinoId = empresa.id_destino;
          row.dataset.horarioApertura = empresa.horario_apertura || '';
          row.dataset.horarioCierre = empresa.horario_cierre || '';
          
          row.innerHTML = `
            <td>${empresa.id_empresa}</td>
            <td>${empresa.nombre}</td>
            <td>${empresa.descripcion || ''}</td>
            <td>${empresa.tipo}</td>
            <td>${empresa.horario_apertura || 'No especificado'} - ${empresa.horario_cierre || 'No especificado'}</td>
            <td>${empresa.destino_nombre}</td>
            <td>${empresa.telefono || 'No especificado'}</td>
            <td>${empresa.usuario_nombre}</td>
            <td class="actions">
              <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
              <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
            </td>
          `;
          empresaTable.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error al cargar empresas:', error);
        showNotification('Error al cargar empresas: ' + error.message, 'error');
      });
  }
  
  // Load usuarios for select
  function loadUsuarios() {
    console.log('Cargando usuarios para selector...');
    
    fetch('/api/usuarios-select')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar usuarios');
        }
        return response.json();
      })
      .then(usuarios => {
        console.log('Usuarios cargados para selector:', usuarios);
        
        const usuarioSelect = document.getElementById('empresa-usuario');
        if (!usuarioSelect) {
          console.error('No se encontró el selector de usuarios');
          return;
        }
        
        // Mantener la opción por defecto
        const defaultOption = usuarioSelect.options[0];
        usuarioSelect.innerHTML = '';
        usuarioSelect.appendChild(defaultOption);
        
        // Añadir los usuarios
        usuarios.forEach(usuario => {
          const option = document.createElement('option');
          option.value = usuario.id_usuario;
          option.textContent = usuario.nombre;
          usuarioSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al cargar usuarios para selector:', error);
        showNotification('Error al cargar usuarios: ' + error.message, 'error');
      });
  }
  
  // Load destinos for select
  function loadDestinos() {
    console.log('Cargando destinos para selector...');
    
    fetch('/api/destinos-select')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar destinos');
        }
        return response.json();
      })
      .then(destinos => {
        console.log('Destinos cargados para selector:', destinos);
        
        const destinoSelect = document.getElementById('empresa-destino');
        if (!destinoSelect) {
          console.error('No se encontró el selector de destinos');
          return;
        }
        
        // Mantener la opción por defecto
        const defaultOption = destinoSelect.options[0];
        destinoSelect.innerHTML = '';
        destinoSelect.appendChild(defaultOption);
        
        // Añadir los destinos
        destinos.forEach(destino => {
          const option = document.createElement('option');
          option.value = destino.id_destino;
          option.textContent = destino.nombre;
          destinoSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al cargar destinos para selector:', error);
        showNotification('Error al cargar destinos: ' + error.message, 'error');
      });
  }
  
  // Show add empresa modal
  function showAddEmpresaModal() {
    console.log('Mostrando modal para añadir empresa...');
    const modalTitle = document.getElementById('modal-title');
    const empresaId = document.getElementById('empresa-id');
    const empresaNombre = document.getElementById('empresa-nombre');
    const empresaDescripcion = document.getElementById('empresa-descripcion');
    const empresaTipo = document.getElementById('empresa-tipo');
    const empresaHorarioApertura = document.getElementById('empresa-horario-apertura');
    const empresaHorarioCierre = document.getElementById('empresa-horario-cierre');
    const empresaTelefono = document.getElementById('empresa-telefono');
    const empresaUsuario = document.getElementById('empresa-usuario');
    const empresaDestino = document.getElementById('empresa-destino');
    
    if (!modalTitle || !empresaId || !empresaNombre || !empresaDescripcion || 
        !empresaTipo || !empresaHorarioApertura || !empresaHorarioCierre || 
        !empresaTelefono || !empresaUsuario || !empresaDestino) {
      console.error('No se encontraron todos los elementos del formulario');
      return;
    }
    
    modalTitle.textContent = 'Añadir Empresa';
    empresaId.value = '';
    empresaNombre.value = '';
    empresaDescripcion.value = '';
    empresaTipo.value = '';
    empresaHorarioApertura.value = '';
    empresaHorarioCierre.value = '';
    empresaTelefono.value = '';
    empresaUsuario.value = '';
    empresaDestino.value = '';
    
    showModal();
  }
  
  // Show edit empresa modal
  function showEditEmpresaModal(id, nombre, descripcion, tipo, horarioApertura, horarioCierre, telefono, usuarioId, destinoId) {
    console.log('Mostrando modal para editar empresa:', id);
    const modalTitle = document.getElementById('modal-title');
    const empresaId = document.getElementById('empresa-id');
    const empresaNombre = document.getElementById('empresa-nombre');
    const empresaDescripcion = document.getElementById('empresa-descripcion');
    const empresaTipo = document.getElementById('empresa-tipo');
    const empresaHorarioApertura = document.getElementById('empresa-horario-apertura');
    const empresaHorarioCierre = document.getElementById('empresa-horario-cierre');
    const empresaTelefono = document.getElementById('empresa-telefono');
    const empresaUsuario = document.getElementById('empresa-usuario');
    const empresaDestino = document.getElementById('empresa-destino');
    
    if (!modalTitle || !empresaId || !empresaNombre || !empresaDescripcion || 
        !empresaTipo || !empresaHorarioApertura || !empresaHorarioCierre || 
        !empresaTelefono || !empresaUsuario || !empresaDestino) {
      console.error('No se encontraron todos los elementos del formulario');
      return;
    }
    
    modalTitle.textContent = 'Editar Empresa';
    empresaId.value = id;
    empresaNombre.value = nombre;
    empresaDescripcion.value = descripcion;
    empresaTipo.value = tipo;
    empresaHorarioApertura.value = horarioApertura;
    empresaHorarioCierre.value = horarioCierre;
    empresaTelefono.value = telefono;
    empresaUsuario.value = usuarioId;
    empresaDestino.value = destinoId;
    
    showModal();
  }
  
  // Show delete confirmation
  function showDeleteConfirmation(id, nombre) {
    console.log('Solicitando confirmación para eliminar empresa:', id);
    if (confirm(`¿Estás seguro de que deseas eliminar la empresa "${nombre}"?`)) {
      deleteEmpresa(id);
    }
  }
  
  // Handle empresa form submit
  function handleEmpresaFormSubmit(e) {
    e.preventDefault();
    
    const empresaId = document.getElementById('empresa-id').value;
    const empresaNombre = document.getElementById('empresa-nombre').value;
    const empresaDescripcion = document.getElementById('empresa-descripcion').value;
    const empresaTipo = document.getElementById('empresa-tipo').value;
    const empresaHorarioApertura = document.getElementById('empresa-horario-apertura').value;
    const empresaHorarioCierre = document.getElementById('empresa-horario-cierre').value;
    const empresaTelefono = document.getElementById('empresa-telefono').value;
    const empresaUsuario = document.getElementById('empresa-usuario').value;
    const empresaDestino = document.getElementById('empresa-destino').value;
    
    if (!empresaNombre || !empresaTipo || !empresaUsuario || !empresaDestino) {
      showNotification('Los campos nombre, tipo, usuario y destino son obligatorios', 'error');
      return;
    }
    
    console.log('Enviando formulario de empresa:', { 
      id: empresaId || 'nueva', 
      nombre: empresaNombre, 
      descripcion: empresaDescripcion,
      tipo: empresaTipo,
      horario_apertura: empresaHorarioApertura,
      horario_cierre: empresaHorarioCierre,
      telefono: empresaTelefono,
      id_usuario: empresaUsuario,
      id_destino: empresaDestino
    });
    
    if (empresaId) {
      updateEmpresa(
        empresaId, 
        empresaNombre, 
        empresaDescripcion, 
        empresaTipo, 
        empresaHorarioApertura, 
        empresaHorarioCierre, 
        empresaTelefono, 
        empresaUsuario, 
        empresaDestino
      );
    } else {
      addEmpresa(
        empresaNombre, 
        empresaDescripcion, 
        empresaTipo, 
        empresaHorarioApertura, 
        empresaHorarioCierre, 
        empresaTelefono, 
        empresaUsuario, 
        empresaDestino
      );
    }
  }
  
  // Add a new empresa
  function addEmpresa(nombre, descripcion, tipo, horario_apertura, horario_cierre, telefono, id_usuario, id_destino) {
    console.log('Añadiendo nueva empresa:', { 
      nombre, 
      descripcion, 
      tipo, 
      horario_apertura, 
      horario_cierre, 
      telefono, 
      id_usuario, 
      id_destino 
    });
    
    // Crear objeto con los datos de la empresa
    const empresaData = {
      nombre,
      descripcion,
      tipo,
      horario_apertura,
      horario_cierre,
      telefono,
      id_usuario,
      id_destino
    };
    
    // Enviar solicitud al servidor
    fetch('/api/empresas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(empresaData)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Error al crear la empresa');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Empresa añadida correctamente:', data);
      
      // Ocultar el modal
      hideModal();
      
      // Recargar las empresas para mostrar la nueva
      loadEmpresas();
      
      // Mostrar notificación de éxito
      showNotification('Empresa añadida correctamente', 'success');
    })
    .catch(error => {
      console.error('Error al añadir empresa:', error);
      showNotification(error.message, 'error');
    });
  }
  
  // Update an existing empresa
  function updateEmpresa(id, nombre, descripcion, tipo, horario_apertura, horario_cierre, telefono, id_usuario, id_destino) {
    console.log('Actualizando empresa:', { 
      id, 
      nombre, 
      descripcion, 
      tipo, 
      horario_apertura, 
      horario_cierre, 
      telefono, 
      id_usuario, 
      id_destino 
    });
    
    // Crear objeto con los datos de la empresa
    const empresaData = {
      nombre,
      descripcion,
      tipo,
      horario_apertura,
      horario_cierre,
      telefono,
      id_usuario,
      id_destino
    };
    
    // Enviar solicitud al servidor
    fetch(`/api/empresas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(empresaData)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Error al actualizar la empresa');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Empresa actualizada correctamente:', data);
      
      // Ocultar el modal
      hideModal();
      
      // Recargar las empresas para mostrar los cambios
      loadEmpresas();
      
      // Mostrar notificación de éxito
      showNotification('Empresa actualizada correctamente', 'success');
    })
    .catch(error => {
      console.error('Error al actualizar empresa:', error);
      showNotification(error.message, 'error');
    });
  }
  
  // Delete a empresa
  function deleteEmpresa(id) {
    console.log('Eliminando empresa:', id);
    
    // Enviar solicitud al servidor
    fetch(`/api/empresas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.error || 'Error al eliminar la empresa');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Empresa eliminada correctamente:', data);
      
      // Recargar las empresas para reflejar la eliminación
      loadEmpresas();
      
      // Mostrar notificación de éxito
      showNotification('Empresa eliminada correctamente', 'success');
    })
    .catch(error => {
      console.error('Error al eliminar empresa:', error);
      showNotification(error.message, 'error');
    });
  }
  
  // Show the modal
  function showModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const empresaModal = document.getElementById('empresa-modal');
    
    if (!modalOverlay || !empresaModal) {
      console.error('No se encontraron los elementos del modal');
      return;
    }
    
    modalOverlay.classList.add('active');
    empresaModal.classList.add('active');
    document.body.classList.add('modal-open');
  }
  
  // Hide the modal
  function hideModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const empresaModal = document.getElementById('empresa-modal');
    
    if (!modalOverlay || !empresaModal) {
      console.error('No se encontraron los elementos del modal');
      return;
    }
    
    modalOverlay.classList.remove('active');
    empresaModal.classList.remove('active');
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
  