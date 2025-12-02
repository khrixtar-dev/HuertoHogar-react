import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getMisTickets } from "../api/ticketApi";
import "../css/mis-compras.css";

function MisCompras() {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCompras();
  }, []);

  const cargarCompras = async () => {
    try {
      setCargando(true);
      const ticketsDelBackend = await getMisTickets();

      // Ordenamiento por 'purchaseDate'
      ticketsDelBackend.sort(
        (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
      );

      setCompras(ticketsDelBackend);
    } catch (error) {
      console.error("Error al cargar los tickets:", error);
      setCompras([]);
    } finally {
      setCargando(false);
    }
  };

  const verDetalle = (compra) => {
    navigate("/boleta", { state: { boletaData: compra } });
  };

  const formatearFecha = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return date.toLocaleTimeString(undefined, options);
  };

  // Función para obtener el total de items
  const getTotalItems = (items) => {
    if (!items || items.length === 0) return 0;
    // La lista se llama 'items' y la cantidad de cada uno se llama 'amount'
    return items.reduce((total, item) => total + item.amount, 0);
  };

  return (
    <Container className="mis-compras-container">
      <Row>
        <Col>
          <h2 className="mb-4 text-center text-white">Mis Compras</h2>

          {cargando ? (
            <div className="text-center text-white">Cargando compras...</div>
          ) : (
            <>
              {compras.length === 0 ? (
                // ... (Bloque de "No tienes compras registradas")
                <Row className="justify-content-center">
                  <Col md={6}>
                    <Card className="text-center shadow">
                      <Card.Body>
                        <h4>No tienes compras registradas</h4>
                        <p>Cuando realices una compra, aparecerá aquí.</p>
                        <Button
                          variant="success"
                          onClick={() => navigate("/tienda")}
                        >
                          Ir a la Tienda
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <div>
                  {compras.map((compra) => (
                    // Usamos 'compra.ticketId' como key
                    <Card key={compra.ticketId} className="mb-3 shadow">
                      <Card.Body>
                        <Row className="align-items-center">
                          {/* Columna ID: md={2} */}
                          <Col md={2}>
                            <h6 className="mb-0 text-success">
                              {/* ✨ CORREGIDO: Usar 'ticketId' */}
                              ID boleta: {compra.ticketId || "N/A"}
                            </h6>
                          </Col>

                          {/* Columna Fecha: Ajustada a md={3} */}
                          <Col md={3}>
                            <p className="mb-0">
                              <strong>Fecha:</strong>{" "}
                              {formatearFecha(compra.purchaseDate)}
                            </p>
                          </Col>

                          {/* ✨ Columna Items RE-INCLUIDA: md={2} */}
                          <Col md={2}>
                            <p className="mb-0">
                              <strong>Items:</strong>{" "}
                              {getTotalItems(compra.items)}
                            </p>
                          </Col>

                          {/* Columna Total: Ajustada a md={3} */}
                          <Col md={3}>
                            <p className="mb-0">
                              <strong>Total:</strong> $
                              {compra.total
                                ? compra.total.toLocaleString()
                                : "N/A"}{" "}
                              CLP
                            </p>
                          </Col>

                          {/* Columna Botón: Ajustada a md={2} (total 2+3+2+3+2=12) */}
                          <Col md={2} className="text-end">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => verDetalle(compra)}
                            >
                              Ver Detalle
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MisCompras;
