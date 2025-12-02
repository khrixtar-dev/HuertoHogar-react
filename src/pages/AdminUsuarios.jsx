import { useEffect, useState } from "react";
import { usuarios as USUARIOS_BASE } from "../../public/js/usuarios";
import { getUsuarios } from "../api/userApi";
import "../css/admin-usuarios.css";

export default function AdminUsuarios() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState(null);

  const emailRegex = /^[\w._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

  // Cargar usuarios al inicio
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        console.log("Cargando usuarios...");
        const data = await getUsuarios();
        console.log("Usuarios recibidos:", data);
        const usuariosFormateados = data.map(u => ({
          id: u.id,
          nombre: u.firstname,
          apellido: u.lastname,
          correo: u.email,
          contraseña: "",
          admin: u.type === "ADMIN"
        }));
        console.log("Usuarios formateados:", usuariosFormateados);
        setListaUsuarios(usuariosFormateados);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        console.error("Detalles:", err.response?.data);
        setListaUsuarios([]);
      }
    };
    cargarUsuarios();
  }, []);



  // Agregar usuario
  const handleAgregar = () => {
    setNuevoUsuario({
      id: "",
      nombre: "",
      apellido: "",
      correo: "",
      contraseña: "",
      admin: false,
    });
  };

  // Guardar nuevo usuario
  const handleGuardarNuevo = () => {
    const u = {
      ...nuevoUsuario,
      id: String(nuevoUsuario.id).trim(),
      nombre: nuevoUsuario.nombre.trim(),
      apellido: nuevoUsuario.apellido.trim(),
      correo: nuevoUsuario.correo.trim(),
      contraseña: nuevoUsuario.contraseña.trim(),
    };

    if (!u.id || !u.nombre || !u.apellido || !u.correo || !u.contraseña) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (!emailRegex.test(u.correo)) {
      alert(
        "Correo inválido. Solo se permiten duoc.cl, profesor.duoc.cl y gmail.com"
      );
      return;
    }

    if (listaUsuarios.some((user) => String(user.id) === String(u.id))) {
      alert("El ID ya existe");
      return;
    }

    setListaUsuarios((prev) => [...prev, u]);
    setNuevoUsuario(null);
  };

  // Editar usuario
  const handleEditar = (id) => setEditandoId(id);

  // Guardar edición
  const handleGuardarEdicion = (id) => {
    const usuarioEditado = listaUsuarios.find((u) => u.id === id);
    if (!usuarioEditado) return;

    const u = {
      ...usuarioEditado,
      nombre: usuarioEditado.nombre?.trim() || "",
      apellido: usuarioEditado.apellido?.trim() || "",
      correo: usuarioEditado.correo?.trim() || "",
      contraseña: usuarioEditado.contraseña?.trim() || "",
    };

    if (!u.nombre || !u.apellido || !u.correo || !u.contraseña) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (!emailRegex.test(u.correo)) {
      alert(
        "Correo inválido. Solo se permiten duoc.cl, profesor.duoc.cl y gmail.com"
      );
      return;
    }

    setListaUsuarios((prev) => prev.map((user) => (user.id === id ? u : user)));
    setEditandoId(null);
  };

  // Eliminar usuario
  const handleEliminar = (id) => {
    if (window.confirm("¿Eliminar este usuario?")) {
      setListaUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // Cancelar acción
  const handleCancelar = () => {
    setEditandoId(null);
    setNuevoUsuario(null);
  };

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


              {listaUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.admin ? "ADMIN" : "CLIENTE"}</td>
                  <td>
                    <button className="ad-usr-btn blue">Editar</button>
                    <button className="ad-usr-btn red">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </section>
    </main>
  );
}
