import API from "./axiosConfig";

export const getUsuarios = async () => {
  const resp = await API.get("/api/v1/admin/usuarios");
  return resp.data;
};

export const getUsuarioById = async (id) => {
  const resp = await API.get(`/api/v1/admin/usuarios/${id}`);
  return resp.data;
};

export const crearUsuario = async (usuario) => {
  const resp = await API.post("/api/v1/admin/usuarios", usuario);
  return resp.data;
};

export const actualizarUsuario = async (id, usuario) => {
  const resp = await API.put(`/api/v1/admin/usuarios/${id}`, usuario);
  return resp.data;
};

export const eliminarUsuario = async (id) => {
  await API.delete(`/api/v1/admin/usuarios/${id}`);
};
