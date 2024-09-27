import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Importamos los estilos CSS

function App() {
    const [items, setItems] = useState([]);
    const [nombre, setnombre] = useState("");
    const [descripcion, setdescripcion] = useState("");
    const [precio, setprecio] = useState("");
    const [cantidad, setcantidad] = useState("");
    const [editMode, setEditMode] = useState(false);  // Para saber si estamos editando
    const [currentItemId, setCurrentItemId] = useState(null);  // Guardar el ID del ítem actual
    const [errorMessage, setErrorMessage] = useState("");  // Para mostrar errores

    // Obtener todos los ítems del backend al cargar el componente
    useEffect(() => {
        fetchItems(); // Extraemos la función para reutilizarla
    }, []);

    const fetchItems = () => {
        axios.get('/inventario2')
            .then(response => setItems(response.data))
            .catch(error => console.error("Error al obtener los ítems: ", error));
    };

    // Validar precio con 2 decimales y valor mayor a 0
    const isValidprecio = (precio) => {
        const precioRegex = /^\d+(\.\d{2})?$/;  // Regex para validar hasta 2 decimales
        const parsedprecio = parseFloat(precio);
        return precioRegex.test(precio) && parsedprecio > 0;
    };

    // Manejar la creación de un nuevo ítem o edición
    const addItem = () => {
        // Validaciones para verificar si los campos están llenos
        if (!nombre || !descripcion || !precio || !cantidad) {
            setErrorMessage("Todos los campos son obligatorios.");
            return;
        }
        
        // Validaciones adicionales (precio debe ser válido)
        if (!isValidprecio(precio)) {
            setErrorMessage("El precio debe ser un valor positivo con 2 decimales y mayor a 0.00.");
            return;
        }

        // Validar que la cantidad sea mayor que 0
        if (cantidad <= 0) {
            setErrorMessage("La cantidad debe ser mayor a 0.");
            return;
        }

        setErrorMessage("");  // Limpiar el mensaje de error si todo está bien

        if (editMode) {
            // Si estamos en modo edición, enviar una solicitud PUT
            axios.put(`inventario2/${currentItemId}`, {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                cantidad: parseInt(cantidad),
            })
            .then(response => {
                // Volvemos a cargar los ítems desde el servidor para asegurar consistencia
                fetchItems();
                setEditMode(false);  // Salimos del modo edición
                setCurrentItemId(null);  // Reseteamos el ID del ítem actual
                clearForm();  // Limpiar el formulario
            })
            .catch(error => console.error("Error al editar el ítem: ", error));
        } else {
            // Si estamos agregando un nuevo ítem, enviar una solicitud POST
            axios.post('/inventario2', {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                cantidad: parseInt(cantidad),
            })
            .then(response => {
                setItems([...items, response.data]);  // Agregamos el nuevo ítem a la lista
                clearForm();
            })
            .catch(error => console.error("Error al agregar ítem: ", error));
        }
    };

    // Función para eliminar ítem
    const deleteItem = (id) => {
        axios.delete(`inventario2/${id}`)
            .then(() => {
                setItems(items.filter(item => item.id !== id));  // Eliminamos el ítem de la lista
            })
            .catch(error => console.error("Error al eliminar el ítem: ", error));
    };

    // Función para editar ítem (llenar el formulario con los datos existentes)
    const editItem = (item) => {
        setnombre(item.nombre);
        setdescripcion(item.descripcion);
        setprecio(item.precio);
        setcantidad(item.cantidad);
        setEditMode(true);
        setCurrentItemId(item.id);
    };

    // Función para cancelar la edición
    const cancelEdit = () => {
        clearForm();
        setEditMode(false);
        setCurrentItemId(null);
    };

    // Limpiar el formulario
    const clearForm = () => {
        setnombre("");
        setdescripcion("");
        setprecio("");
        setcantidad("");
        setErrorMessage("");
    };

    return (
        <div classnombre="container">
            <h1>{editMode ? "Editar Ítem" : "Agregar Ítem al Inventario"}</h1>
            <div>
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={nombre}
                    onChange={e => setnombre(e.target.value)}
                />
                <textarea
                    placeholder="Descripción del producto"
                    value={descripcion}
                    onChange={e => setdescripcion(e.target.value)}
                    rows="3"
                    style={{ width: "100%" }}
                />
                <input
                    type="text"
                    placeholder="Precio (Ejemplo: 10.00)"
                    value={precio}
                    onChange={e => setprecio(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Cantidad"
                    value={cantidad}
                    onChange={e => setcantidad(e.target.value)}
                    min="1"
                />

                <div>
                    <button onClick={addItem}>
                        {editMode ? "Guardar Cambios" : "Agregar Ítem"}
                    </button>
                    {editMode && (
                        <button onClick={cancelEdit} style={{ marginLeft: "10px", backgroundColor: "gray" }}>
                            Cancelar
                        </button>
                    )}
                </div>

                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>

            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <strong>{item.nombre}</strong><br />
                        {item.descripcion}<br />
                        <span>Precio: ${item.precio}</span><br />
                        <span>Cantidad: {item.cantidad}</span>
                        <br />
                        <button onClick={() => editItem(item)} style={{ marginRight: "10px" }}>Editar</button>
                        <button onClick={() => deleteItem(item.id)} style={{ backgroundColor: "red", color: "white" }}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
);
}

export default App;