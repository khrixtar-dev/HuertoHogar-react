import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, ListGroup } from "react-bootstrap";

function Boleta() {
  const location = useLocation();
  const { boletaData } = location.state || {}; // Obtiene los datos del ticket desde la navegación

  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (boletaData) {
      setTicket(boletaData); // Establecer los datos del ticket
    }
  }, [boletaData]);

  if (!ticket) {
    return <div>Cargando...</div>;
  }

  return (
    <Container className="boleta-container">
      <h2 className="text-center my-4">Tu Boleta</h2>

      <Card className="mb-4">
        <Card.Header>
          <h5>Detalles de la Compra</h5>
        </Card.Header>
        <Card.Body>
          <p>
            <strong>Fecha de compra:</strong>{" "}
            {new Date(ticket.purchaseDate).toLocaleString()}
          </p>
          <p>
            <strong>Total:</strong> ${ticket.total.toLocaleString()} CLP
          </p>

          <ListGroup variant="flush">
            {ticket.items.map((item) => (
              <ListGroup.Item key={item.productId}>
                <div className="d-flex justify-content-between">
                  <span>
                    {item.productName} x{item.amount}
                  </span>
                  <span>${item.subtotal.toLocaleString()}</span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Boleta;
