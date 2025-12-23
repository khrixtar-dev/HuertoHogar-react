import { useEffect, useState } from "react";
import {
  getUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  crearUsuario, // Asegúrate de importar esta función
} from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import "../css/admin-usuarios.css";

export default function AdminUsuarios() {
  const { user } = useAuth();
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    type: "USER", // Tipo de usuario por defecto
  });

  const emailRegex = /^[\w._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await getUsuarios();
      setListaUsuarios(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      alert("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleCrearUsuario = async () => {
    if (
      !nuevoUsuario.firstname ||
      !nuevoUsuario.lastname ||
      !nuevoUsuario.email ||
      !nuevoUsuario.password
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (!emailRegex.test(nuevoUsuario.email)) {
      alert(
        "Correo inválido. Solo se permiten duoc.cl, profesor.duoc.cl y gmail.com"
      );
      return;
    }

    try {
      await crearUsuario(nuevoUsuario);
      setNuevoUsuario({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        type: "USER",
      }); // Limpiar los campos después de la creación
      await cargarUsuarios(); // Recargar la lista de usuarios
      alert("Usuario creado exitosamente");
    } catch (error) {
      console.error("Error creando usuario:", error);
      alert(error.response?.data || "Error al crear el usuario");
    }
  };

  const handleEditar = (id, email) => {
    if (user?.email === email) {
      alert("No puedes editar tu propia cuenta");
      return;
    }
    setEditandoId(id);
  };

  const handleGuardarEdicion = async (id, usuario) => {
    if (!usuario.firstname || !usuario.lastname || !usuario.email) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (!emailRegex.test(usuario.email)) {
      alert(
        "Correo inválido. Solo se permiten duoc.cl, profesor.duoc.cl y gmail.com"
      );
      return;
    }

    try {
      const payload = {
        firstname: usuario.firstname,
        lastname: usuario.lastname,
        email: usuario.email,
        type: usuario.type,
      };
      await actualizarUsuario(id, payload);
      await cargarUsuarios();
      setEditandoId(null);
      alert("Usuario actualizado exitosamente");
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      alert(error.response?.data || "Error al actualizar el usuario");
    }
  };

  const handleEliminar = async (id, email) => {
    if (user?.email === email) {
      alert("No puedes eliminar tu propia cuenta");
      return;
    }
    if (window.confirm("¿Eliminar este usuario?")) {
      try {
        await eliminarUsuario(id);
        await cargarUsuarios();
        alert("Usuario eliminado exitosamente");
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        alert(error.response?.data || "Error al eliminar el usuario");
      }
    }
  };

  const handleCancelar = () => {
    setEditandoId(null);
  };

  if (loading) {
    return (
      <main className="ad-usr-page">
        <section className="ad-usr-container">
          <h2>Gestión de Usuarios</h2>
          <p>Cargando usuarios...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="ad-usr-page">
      <section className="ad-usr-container">
        <h2>Gestión de Usuarios</h2>

        {/* Formulario para crear un nuevo usuario */}
        <div className="create-user-form">
          <h3>Crear Usuario</h3>
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoUsuario.firstname}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, firstname: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Apellido"
            value={nuevoUsuario.lastname}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, lastname: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Correo"
            value={nuevoUsuario.email}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
            }
          />
          <select
            value={nuevoUsuario.type}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, type: e.target.value })
            }
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <button onClick={handleCrearUsuario}>Crear Usuario</button>
        </div>

        <div className="table-responsive">
          <table className="ad-usr-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaUsuarios.map((usuario) =>
                editandoId === usuario.id ? (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={usuario.firstname}
                        onChange={(e) =>
                          setListaUsuarios((prev) =>
                            prev.map((u) =>
                              u.id === usuario.id
                                ? { ...u, firstname: e.target.value }
                                : u
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={usuario.lastname}
                        onChange={(e) =>
                          setListaUsuarios((prev) =>
                            prev.map((u) =>
                              u.id === usuario.id
                                ? { ...u, lastname: e.target.value }
                                : u
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        className="form-control"
                        value={usuario.email}
                        onChange={(e) =>
                          setListaUsuarios((prev) =>
                            prev.map((u) =>
                              u.id === usuario.id
                                ? { ...u, email: e.target.value }
                                : u
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={usuario.type === "ADMIN"}
                        onChange={(e) =>
                          setListaUsuarios((prev) =>
                            prev.map((u) =>
                              u.id === usuario.id
                                ? {
                                    ...u,
                                    type: e.target.checked ? "ADMIN" : "USER",
                                  }
                                : u
                            )
                          )
                        }
                      />
                      <span style={{ marginLeft: "0.5rem" }}>
                        {usuario.type}
                      </span>
                    </td>
                    <td>
                      <button
                        className="ad-usr-btn green"
                        onClick={() =>
                          handleGuardarEdicion(usuario.id, usuario)
                        }
                      >
                        Guardar
                      </button>
                      <button
                        className="ad-usr-btn gray"
                        onClick={handleCancelar}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.firstname}</td>
                    <td>{usuario.lastname}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.type}</td>
                    <td>
                      <button
                        className="ad-usr-btn blue"
                        onClick={() => handleEditar(usuario.id, usuario.email)}
                      >
                        Editar
                      </button>
                      <button
                        className="ad-usr-btn red"
                        onClick={() =>
                          handleEliminar(usuario.id, usuario.email)
                        }
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
      </section>
    </main>
  );
}
