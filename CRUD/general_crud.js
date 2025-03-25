document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elementos del DOM para Calificaciones ---
    const calificacionForm = document.getElementById('calificacion-form');
    const calificacionesList = document.getElementById('calificaciones');
    const calificacionIdInput = document.getElementById('calificacion-id');
    const calificacionIdUsuarioInput = document.getElementById('calificacion-id_usuario');
    const calificacionIdDestinoInput = document.getElementById('calificacion-id_destino');
    const calificacionCalificacionInput = document.getElementById('calificacion-calificacion');
    const calificacionComentarioInput = document.getElementById('calificacion-comentario');
    const cancelCalificacionUpdateButton = document.getElementById('cancel-calificacion-update');
    let editingCalificacionId = null;

    // --- Funciones para Calificaciones ---
    const loadCalificaciones = async () => {
        const response = await fetch('/api/calificaciones');
        const calificaciones = await response.json();
        displayCalificaciones(calificaciones);
    };

    const displayCalificaciones = (calificaciones) => {
        calificacionesList.innerHTML = '';
        calificaciones.forEach(calificacion => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>Usuario: ${calificacion.id_usuario}, Destino: ${calificacion.id_destino}, Calificación: ${calificacion.calificacion}, Comentario: ${calificacion.comentario}</span>
                <div class="actions">
                    <button class="edit-calificacion-btn" data-id="${calificacion.id_calificacion}">Editar</button>
                    <button class="delete-calificacion-btn" data-id="${calificacion.id_calificacion}">Eliminar</button>
                </div>
            `;
            calificacionesList.appendChild(listItem);
        });
        document.querySelectorAll('.edit-calificacion-btn').forEach(button => button.addEventListener('click', editCalificacion));
        document.querySelectorAll('.delete-calificacion-btn').forEach(button => button.addEventListener('click', deleteCalificacion));
    };

    calificacionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id_usuario = parseInt(calificacionIdUsuarioInput.value);
        const id_destino = parseInt(calificacionIdDestinoInput.value);
        const calificacion = parseInt(calificacionCalificacionInput.value);
        const comentario = calificacionComentarioInput.value;
        const calificacionData = { id_usuario, id_destino, calificacion, comentario };
        const method = editingCalificacionId ? 'PUT' : 'POST';
        const url = editingCalificacionId ? `/api/calificaciones/${editingCalificacionId}` : '/api/calificaciones';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(calificacionData)
        });

        if (response.ok) {
            loadCalificaciones();
            calificacionForm.reset();
            editingCalificacionId = null;
            cancelCalificacionUpdateButton.style.display = 'none';
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    });

    const editCalificacion = async (e) => {
        const calificacionId = e.target.getAttribute('data-id');
        const response = await fetch(`/api/calificaciones/${calificacionId}`);
        const calificacion = await response.json();

        calificacionIdInput.value = calificacion.id_calificacion;
        calificacionIdUsuarioInput.value = calificacion.id_usuario;
        calificacionIdDestinoInput.value = calificacion.id_destino;
        calificacionCalificacionInput.value = calificacion.calificacion;
        calificacionComentarioInput.value = calificacion.comentario;
        editingCalificacionId = calificacion.id_calificacion;
        cancelCalificacionUpdateButton.style.display = 'inline-block';
    };

    const deleteCalificacion = async (e) => {
        const calificacionId = e.target.getAttribute('data-id');
        if (confirm('¿Estás seguro de que quieres eliminar esta calificación?')) {
            const response = await fetch(`/api/calificaciones/${calificacionId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadCalificaciones();
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        }
    };

    cancelCalificacionUpdateButton.addEventListener('click', () => {
        calificacionForm.reset();
        editingCalificacionId = null;
        cancelCalificacionUpdateButton.style.display = 'none';
    });

    // Cargar las listas iniciales
    loadTours();
    loadCalificaciones();
});