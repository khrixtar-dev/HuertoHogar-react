import { useEffect, useState } from "react";
import { getUsuarios, actualizarUsuario, eliminarUsuario } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import "../css/admin-usuarios.css";

export default function AdminUsuarios() {
  const { user } = useAuth();
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(true);

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
      alert("Correo inválido. Solo se permiten duoc.cl, profesor.duoc.cl y gmail.com");
      return;
    }

    try {
      const payload = {
        firstname: usuario.firstname,
        lastname: usuario.lastname,
        email: usuario.email,
        type: usuario.type
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
                                ? { ...u, type: e.target.checked ? "ADMIN" : "USER" }
                                : u
                            )
                          )
                        }
                      />
                      <span style={{ marginLeft: "0.5rem" }}>{usuario.type}</span>
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
                        onClick={() => handleEliminar(usuario.id, usuario.email)}
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
