import API from "./axiosConfig";

export const loginUsuario = async (email, password) => {
  const resp = await API.post("/api/v1/auth/authenticate", {
    email: email,
    password: password,
  });
  return resp.data;
};

export const registrarUsuario = async (usuario) => {
  const resp = await API.post("/api/v1/auth/register", usuario);
  return resp.data;
};
