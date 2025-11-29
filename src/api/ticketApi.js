import API from "./axiosConfig";

export const crearTicket = async (body) => {
  const resp = await API.post("/api/tickets", body);
  return resp.data;
};

export const getMisTickets = async () => {
  const resp = await API.get("/api/tickets/my");
  return resp.data;
};

export const getTicketById = async (id) => {
  const resp = await API.get(`/api/tickets/${id}`);
  return resp.data;
};
