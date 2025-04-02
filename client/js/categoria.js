// Category Management JavaScript

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando gestión de categorías...")

  // Get references to elements
  const addCategoryBtn = document.querySelector("#categorias_seccion .add-btn")
  const categoryTable = document.querySelector("#categorias_seccion .admin-table tbody")
  const modalOverlay = document.getElementById("modal-overlay") || createModalOverlay()
  const categoryModal = document.getElementById("category-modal") || createCategoryModal()

  // Add event listeners
  addCategoryBtn.addEventListener("click", showAddCategoryModal)

  // Add event delegation for edit and delete buttons
  categoryTable.addEventListener("click", (e) => {
    const target = e.target.closest(".action-btn")
    if (!target) return

    const row = target.closest("tr")
    const categoryId = row.cells[0].textContent
    const categoryName = row.cells[1].textContent
    const categoryDescription = row.cells[2].textContent

    if (target.classList.contains("edit-btn")) {
      showEditCategoryModal(categoryId, categoryName, categoryDescription)
    } else if (target.classList.contains("delete-btn")) {
      showDeleteConfirmation(categoryId, categoryName)
    }
  })

  // Initialize the category form
  initCategoryForm()

  // Load categories from database
  loadCategories()
})

// Create modal overlay if it doesn't exist
function createModalOverlay() {
  console.log("Creando overlay del modal...")
  const overlay = document.createElement("div")
  overlay.id = "modal-overlay"
  overlay.className = "modal-overlay"
  document.body.appendChild(overlay)
  return overlay
}

// Create category modal if it doesn't exist
function createCategoryModal() {
  console.log("Creando modal de categorías...")
  const modal = document.createElement("div")
  modal.id = "category-modal"
  modal.className = "modal"
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title">Añadir Categoría</h2>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="category-form">
          <input type="hidden" id="category-id">
          <div class="form-group">
            <label for="category-name">Nombre:</label>
            <input type="text" id="category-name" required>
          </div>
          <div class="form-group">
            <label for="category-description">Descripción:</label>
            <textarea id="category-description" rows="4" required></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary cancel-btn">Cancelar</button>
            <button type="submit" class="btn btn-primary save-btn">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `
  document.body.appendChild(modal)
  return modal
}

// Initialize the category form
function initCategoryForm() {
  console.log("Inicializando formulario de categorías...")
  const categoryForm = document.getElementById("category-form")
  const closeModalBtn = document.querySelector(".close-modal")
  const cancelBtn = document.querySelector(".cancel-btn")
  const modalOverlay = document.getElementById("modal-overlay")

  categoryForm.addEventListener("submit", handleCategoryFormSubmit)
  closeModalBtn.addEventListener("click", hideModal)
  cancelBtn.addEventListener("click", hideModal)
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      hideModal()
    }
  })
}

// Modificar la función loadCategories para no mostrar la columna de destinos asociados
function loadCategories() {
  console.log("Cargando categorías desde la API...")

  // Primero, verificamos que la API esté funcionando
  fetch("/api/test")
    .then((response) => {
      if (!response.ok) {
        throw new Error("API no disponible")
      }
      return response.json()
    })
    .then((data) => {
      console.log("API test exitoso:", data)

      // Ahora cargamos las categorías
      return fetch("/api/categories")
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar categorías")
      }
      return response.json()
    })
    .then((categories) => {
      console.log("Categorías cargadas:", categories)

      const categoryTable = document.querySelector("#categorias_seccion .admin-table tbody")
      categoryTable.innerHTML = "" // Clear existing rows

      categories.forEach((category) => {
        const row = document.createElement("tr")
        row.innerHTML = `
          <td>${category.id_categoria}</td>
          <td>${category.nombre}</td>
          <td>${category.descripcion}</td>
          <td class="actions">
            <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
          </td>
        `
        categoryTable.appendChild(row)
      })
    })
    .catch((error) => {
      console.error("Error al cargar categorías:", error)
      showNotification("Error al cargar categorías: " + error.message, "error")
    })
}


// Show add category modal
function showAddCategoryModal() {
  console.log("Mostrando modal para añadir categoría...")
  const modalTitle = document.getElementById("modal-title")
  const categoryForm = document.getElementById("category-form")
  const categoryId = document.getElementById("category-id")
  const categoryName = document.getElementById("category-name")
  const categoryDescription = document.getElementById("category-description")

  modalTitle.textContent = "Añadir Categoría"
  categoryId.value = ""
  categoryName.value = ""
  categoryDescription.value = ""

  showModal()
}

// Show edit category modal
function showEditCategoryModal(id, name, description) {
  console.log("Mostrando modal para editar categoría:", id)
  const modalTitle = document.getElementById("modal-title")
  const categoryId = document.getElementById("category-id")
  const categoryName = document.getElementById("category-name")
  const categoryDescription = document.getElementById("category-description")

  modalTitle.textContent = "Editar Categoría"
  categoryId.value = id
  categoryName.value = name
  categoryDescription.value = description

  showModal()
}

// Show delete confirmation
function showDeleteConfirmation(id, name) {
  console.log("Solicitando confirmación para eliminar categoría:", id)
  if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${name}"?`)) {
    deleteCategory(id)
  }
}

// Handle category form submit
function handleCategoryFormSubmit(e) {
  e.preventDefault()

  const categoryId = document.getElementById("category-id").value
  const categoryName = document.getElementById("category-name").value
  const categoryDescription = document.getElementById("category-description").value

  console.log("Enviando formulario de categoría:", {
    id: categoryId || "nueva",
    nombre: categoryName,
    descripcion: categoryDescription,
  })

  if (categoryId) {
    updateCategory(categoryId, categoryName, categoryDescription)
  } else {
    addCategory(categoryName, categoryDescription)
  }
}

// Add a new category
function addCategory(name, description) {
  console.log("Añadiendo nueva categoría:", { nombre: name, descripcion: description })

  // Crear objeto con los datos de la categoría
  const categoryData = {
    nombre: name,
    descripcion: description,
  }

  // Enviar solicitud al servidor
  fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || "Error al crear la categoría")
        })
      }
      return response.json()
    })
    .then((data) => {
      console.log("Categoría añadida correctamente:", data)

      // Ocultar el modal
      hideModal()

      // Recargar las categorías para mostrar la nueva
      loadCategories()

      // Mostrar notificación de éxito
      showNotification("Categoría añadida correctamente", "success")
    })
    .catch((error) => {
      console.error("Error al añadir categoría:", error)
      showNotification(error.message, "error")
    })
}

// Update an existing category
function updateCategory(id, name, description) {
  console.log("Actualizando categoría:", { id, nombre: name, descripcion: description })

  // Crear objeto con los datos de la categoría
  const categoryData = {
    nombre: name,
    descripcion: description,
  }

  // Enviar solicitud al servidor
  fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || "Error al actualizar la categoría")
        })
      }
      return response.json()
    })
    .then((data) => {
      console.log("Categoría actualizada correctamente:", data)

      // Ocultar el modal
      hideModal()

      // Recargar las categorías para mostrar los cambios
      loadCategories()

      // Mostrar notificación de éxito
      showNotification("Categoría actualizada correctamente", "success")
    })
    .catch((error) => {
      console.error("Error al actualizar categoría:", error)
      showNotification(error.message, "error")
    })
}

// Delete a category
function deleteCategory(id) {
  console.log("Eliminando categoría:", id)

  // Enviar solicitud al servidor
  fetch(`/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || "Error al eliminar la categoría")
        })
      }
      return response.json()
    })
    .then((data) => {
      console.log("Categoría eliminada correctamente:", data)

      // Recargar las categorías para reflejar la eliminación
      loadCategories()

      // Mostrar notificación de éxito
      showNotification("Categoría eliminada correctamente", "success")
    })
    .catch((error) => {
      console.error("Error al eliminar categoría:", error)
      showNotification(error.message, "error")
    })
}

// Show the modal
function showModal() {
  document.getElementById("modal-overlay").classList.add("active")
  document.getElementById("category-modal").classList.add("active")
  document.body.classList.add("modal-open")
}

// Hide the modal
function hideModal() {
  document.getElementById("modal-overlay").classList.remove("active")
  document.getElementById("category-modal").classList.remove("active")
  document.body.classList.remove("modal-open")
}

// Show notification
function showNotification(message, type = "info") {
  console.log(`Notificación (${type}):`, message)

  // Create notification element if it doesn't exist
  let notification = document.getElementById("notification")
  if (!notification) {
    notification = document.createElement("div")
    notification.id = "notification"
    notification.className = "notification"
    document.body.appendChild(notification)
  }

  // Set notification content and type
  notification.textContent = message
  notification.className = `notification ${type}`
  notification.classList.add("active")

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("active")
  }, 3000)
}

