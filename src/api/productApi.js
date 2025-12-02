import API from "./axiosConfig";

export const getProductos = async () => {
  const resp = await API.get("/api/products");
  return resp.data;
};

export const getProductoById = async (id) => {
  const resp = await API.get(`/api/products/${id}`);
  return resp.data;
};

export const crearProducto = async (producto) => {
  const resp = await API.post("/api/products", producto);
  return resp.data;
};

export const actualizarProducto = async (id, producto) => {
  const resp = await API.put(`/api/products/${id}`, producto);
  return resp.data;
};

export const eliminarProducto = async (id) => {
  await API.delete(`/api/products/${id}`);
};
