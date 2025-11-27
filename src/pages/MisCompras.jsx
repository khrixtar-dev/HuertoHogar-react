import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuarioActual } from '../../public/js/persistenciaLogin';
import '../css/mis-compras.css';

function MisCompras() {
  const [compras, setCompras] = useState([]);
  const navigate = useNavigate();
  const usuario = obtenerUsuarioActual();

  useEffect(() => {
    cargarCompras();
  }, []);

  const cargarCompras = () => {
    if (usuario) {
      const tickets = localStorage.getItem('tickets');
      if (tickets) {
        const todosLosTickets = JSON.parse(tickets);
        const comprasUsuario = todosLosTickets.filter(ticket => ticket.usuarioId === usuario.correo);
        comprasUsuario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setCompras(comprasUsuario);
      }
    }
  };

  const verDetalle = (compra) => {
    navigate('/boleta', { state: { boletaData: compra } });
  };

  return (
    <Container className="mis-compras-container">
      <Row>
        <Col>
          <h2 className="mb-4 text-center text-white">Mis Compras</h2>
          
          {compras.length === 0 ? (
            <Row className="justify-content-center">
              <Col md={6}>
                <Card className="text-center shadow">
                  <Card.Body>
                    <h4>No tienes compras registradas</h4>
                    <p>Cuando realices una compra, aparecerá aquí.</p>
                    <Button variant="success" onClick={() => navigate('/tienda')}>
                      Ir a la Tienda
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <div>
              {compras.map((compra) => (
                <Card key={compra.id} className="mb-3 shadow">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={2}>
                        <h6 className="mb-0 text-success">ID boleta: {compra.id}</h6>
                      </Col>
                      <Col md={2}>
                        <p className="mb-0"><strong>Fecha:</strong> {compra.fecha}</p>
                      </Col>
                      <Col md={2}>
                        <p className="mb-0"><strong>Items:</strong> {compra.productos.reduce((total, p) => total + p.cantidad, 0)}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0"><strong>Total:</strong> ${compra.total.toLocaleString()} CLP</p>
                      </Col>
                      <Col md={3} className="text-end">
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
        </Col>
      </Row>
    </Container>
  );
}

export default MisCompras;