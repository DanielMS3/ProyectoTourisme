import React, { useState, useEffect } from "react";
import axios from "axios";

// API Base URL
const API_URL = "http://localhost:3001/contenidos"; 

// Opciones de categoría y ubicación
const categorias = ["Parques y Reservas", "Miradores", "Museos y Cultura", "Actividades y Aventura", "Plazas y Parque Urbanos"];
const ubicaciones = ["Medellin", "Bello", "Envigado", "Sabaneta", "Itagüi", "La Estrella", "El Retiro", "Todas las Ubicaciones"];

const ContentManager = () => {
  const [contenidos, setContenidos] = useState([]); // Lista de contenidos desde la API
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
    category: categorias[0],
    location: ubicaciones[0]
  });
  const [editId, setEditId] = useState(null); // ID del contenido en edición

  // Obtener contenidos desde el backend al cargar el componente
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => setContenidos(res.data))
      .catch((error) => console.error("Error obteniendo datos:", error));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario (Agregar o Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editId) {
        // Editar contenido existente
        await axios.put(`${API_URL}/${editId}`, form);
        setContenidos(contenidos.map((c) => (c.id === editId ? { ...form, id: editId } : c)));
      } else {
        // Agregar nuevo contenido
        const res = await axios.post(API_URL, form);
        setContenidos([...contenidos, res.data]);
      }
      
      // Resetear formulario y edición
      setForm({ title: "", description: "", image: "", price: "", category: categorias[0], location: ubicaciones[0] });
      setEditId(null);
    } catch (error) {
      console.error("Error guardando contenido:", error);
    }
  };

  // Preparar edición: cargar datos en el formulario
  const handleEdit = (id) => {
    const contenido = contenidos.find((c) => c.id === id);
    setForm(contenido);
    setEditId(id);
  };

  // Eliminar contenido
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setContenidos(contenidos.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error eliminando contenido:", error);
    }
  };

  return (
    <div>
      <h1>Gestión de Contenidos</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
        <input type="text" name="image" placeholder="URL de la imagen" value={form.image} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Precio" value={form.price} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange}>
          {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select name="location" value={form.location} onChange={handleChange}>
          {ubicaciones.map((ubi) => <option key={ubi} value={ubi}>{ubi}</option>)}
        </select>
        <button type="submit">{editId ? "Actualizar Contenido" : "Agregar Contenido"}</button>
      </form>

      {/* Listado de contenidos */}
      <h2>Lista de Contenidos</h2>
      {categorias.map((categoria) => (
        <div key={categoria}>
          <h3>{categoria}</h3>
          {contenidos.filter((c) => c.category === categoria).length === 0 ? (
            <p>No hay contenidos en esta categoría.</p>
          ) : (
            contenidos
              .filter((c) => c.category === categoria)
              .map((item) => (
                <div key={item.id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "0.5rem" }}>
                  <h4>{item.title} ({item.location})</h4>
                  <p>{item.description}</p>
                  <img src={item.image} alt={item.title} width="200" />
                  <p>Precio: ${item.price}</p>
                  <button onClick={() => handleEdit(item.id)}>Editar</button>
                  <button onClick={() => handleDelete(item.id)}>Eliminar</button>
                </div>
              ))
          )}
        </div>
      ))}
    </div>
  );
};

export default ContentManager;
