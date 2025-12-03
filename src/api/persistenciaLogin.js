import { usuarios as usuariosBase } from "./usuarios.js";

const get = (key) => JSON.parse(localStorage.getItem(key) || "null");
const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const remove = (key) => localStorage.removeItem(key);

export function obtenerUsuarios() {
  return get("usuarios") || usuariosBase;
}
export function guardarUsuarios(users) {
  set("usuarios", users);
}
export function cuentaIniciada() {
  return get("cuentaIniciada") === true;
}

export function obtenerUsuarioActual() {
  return get("usuarioActual");
}
export function esAdmin() {
  return obtenerUsuarioActual()?.admin === true;
}

// FUNCIONES DE AUTENTICACIÓN

export function setSesion(usuario) {
  set("cuentaIniciada", true);
  set("usuarioActual", usuario);
}

// Intenta iniciar sesión con email y contraseña

export function iniciarSesion(correo, contraseña) {
  const user = obtenerUsuarios().find(u => u.correo === correo && u.contraseña === contraseña);
  if (user) {
    setSesion(user);  // Si encuentra el usuario, inicia sesión
    return { success: true, usuario: user };
  }
  return { success: false };  // Si no lo encuentra, falla
}

// Cierra la sesión eliminando todos los datos de localStorage
export function cerrarSesion() {
  remove("cuentaIniciada");
  remove("usuarioActual");
  remove("authToken");
}

// Registra un nuevo usuario en el sistema
export function registrarUsuario(userData) {
  const users = obtenerUsuarios(); // Obtiene usuarios actuales
  
  // Verificar si el correo ya existe
  if (users.find(u => u.correo === userData.correo)) {
    return { success: false, error: "El correo ya está registrado" };
  }
  
  const newUser = { ...userData, id: Date.now(), admin: false }; // Crea nuevo usuario con ID único
  guardarUsuarios([...users, newUser]);
  return { success: true, usuario: newUser };// Guardalista actualizada

}