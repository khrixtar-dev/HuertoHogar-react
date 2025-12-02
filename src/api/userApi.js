import API from "./axiosConfig";

export const getUsuarios = async () => {
  const resp = await API.get("/api/v1/admin/usuarios");
  return resp.data;
};
