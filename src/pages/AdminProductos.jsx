import React, { useEffect, useState } from "react";
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from "../api/productApi";
import "../css/admin-productos.css";

export default function AdminProductos() {
  const [listaProductos, setListaProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      setListaProductos(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
      alert("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = () => {
    setNuevoProducto({
      name: "",
      price: "",
      urlImage: "",
      description: ""
    });
  };

  const handleGuardarNuevo = async () => {
    if (!nuevoProducto.name || !nuevoProducto.price || !nuevoProducto.urlImage || !nuevoProducto.description) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (isNaN(nuevoProducto.price)) {
      alert("El precio debe ser un número válido");
      return;
    }

    try {
      await crearProducto({
        name: nuevoProducto.name,
        description: nuevoProducto.description,
        price: parseFloat(nuevoProducto.price),
        urlImage: nuevoProducto.urlImage
      });
      await cargarProductos();
      setNuevoProducto(null);
      alert("Producto creado exitosamente");
    } catch (error) {
      console.error("Error creando producto:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      alert("Error al crear el producto");
    }
  };

  const handleEditar = (id) => setEditandoId(id);

  const handleGuardarEdicion = async (id, producto) => {
    if (!producto.name || !producto.price || !producto.urlImage || !producto.description) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (isNaN(producto.price)) {
      alert("El precio debe ser un número válido");
      return;
    }

    try {
      const payload = {
        name: producto.name,
        description: producto.description,
        price: parseFloat(producto.price),
        urlImage: producto.urlImage,
        category: producto.category || null
      };
      console.log("ID:", id, "Payload:", payload);
      await actualizarProducto(id, payload);
      await cargarProductos();
      setEditandoId(null);
      alert("Producto actualizado exitosamente");
    } catch (error) {
      console.error("Error actualizando producto:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      alert("Error al actualizar el producto");
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      try {
        await eliminarProducto(id);
        await cargarProductos();
        alert("Producto eliminado exitosamente");
      } catch (error) {
        console.error("Error eliminando producto:", error);
        console.error("Respuesta del servidor:", error.response?.data);
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setNuevoProducto(null);
  };

  if (loading) {
    return (
      <main className="ad-prod-page">
        <section className="ad-prod-container">
          <h2>Gestión de Productos</h2>
          <p>Cargando productos...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="ad-prod-page">
      <section className="ad-prod-container">
        <h2>Gestión de Productos</h2>

        <div className="ad-prod-table-wrapper">
          <table className="ad-prod-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Imagen</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {nuevoProducto && (
                <tr className="ad-prod-row-new">
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Auto-generado"
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={nuevoProducto.name}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={nuevoProducto.price}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, price: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="URL de imagen"
                      value={nuevoProducto.urlImage}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, urlImage: e.target.value })
                      }
                    />
                    {nuevoProducto.urlImage && (
                      <img
                        src={nuevoProducto.urlImage}
                        alt="Preview"
                        className="ad-prod-img"
                      />
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={nuevoProducto.description}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, description: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="ad-prod-btn green"
                      onClick={handleGuardarNuevo}
                    >
                      Guardar
                    </button>
                    <button
                      className="ad-prod-btn gray"
                      onClick={handleCancelar}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              )}

              {listaProductos.map((producto) =>
                editandoId === producto.id ? (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={producto.name}
                        onChange={(e) =>
                          setListaProductos((prev) =>
                            prev.map((p) =>
                              p.id === producto.id
                                ? { ...p, name: e.target.value }
                                : p
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={producto.price}
                        onChange={(e) =>
                          setListaProductos((prev) =>
                            prev.map((p) =>
                              p.id === producto.id
                                ? { ...p, price: e.target.value }
                                : p
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={producto.urlImage}
                        onChange={(e) =>
                          setListaProductos((prev) =>
                            prev.map((p) =>
                              p.id === producto.id
                                ? { ...p, urlImage: e.target.value }
                                : p
                            )
                          )
                        }
                      />
                      {producto.urlImage && (
                        <img
                          src={producto.urlImage}
                          alt={producto.name}
                          className="ad-prod-img"
                        />
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={producto.description}
                        onChange={(e) =>
                          setListaProductos((prev) =>
                            prev.map((p) =>
                              p.id === producto.id
                                ? { ...p, description: e.target.value }
                                : p
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="ad-prod-btn green"
                        onClick={() =>
                          handleGuardarEdicion(producto.id, producto)
                        }
                      >
                        Guardar
                      </button>
                      <button
                        className="ad-prod-btn gray"
                        onClick={handleCancelar}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>{producto.name}</td>
                    <td>${Number(producto.price).toLocaleString()}</td>
                    <td>
                      <img
                        src={producto.urlImage}
                        alt={producto.name}
                        className="ad-prod-img"
                      />
                    </td>
                    <td>{producto.description}</td>
                    <td>
                      <button
                        className="ad-prod-btn blue"
                        onClick={() => handleEditar(producto.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="ad-prod-btn red"
                        onClick={() => handleEliminar(producto.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <button className="ad-prod-btn green" onClick={handleAgregar}>
          Agregar Producto
        </button>
      </section>
    </main>
  );
}
