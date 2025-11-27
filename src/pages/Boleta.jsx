import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { obtenerUsuarioActual, cuentaIniciada } from '../../public/js/persistenciaLogin';
import '../css/boleta.css';

function Boleta() {
  const location = useLocation();
  const { boletaData } = location.state || {};
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (cuentaIniciada()) {
      setUsuario(obtenerUsuarioActual());
    }
  }, []);

  if (!boletaData) {
    return (
      <Container className="boleta-container">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="mt-5">
              <Card.Body className="text-center">
                <h3>No se encontraron datos de la boleta</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="boleta-container">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="mt-4 shadow">
            <Card.Header className="text-center bg-success text-white">
              <h3>HUERTO HOGAR SPA</h3>
              <h5>BOLETA DE VENTA</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>ID:</strong> {boletaData.id}</p>
                  <p><strong>Cliente:</strong> {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Invitado'}</p>
                </Col>
                <Col md={6} className="text-end">
                  <p><strong>Fecha:</strong> {boletaData.fecha}</p>
                </Col>
              </Row>

              {boletaData.productos.map((producto, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body className="py-2">
                    <Row className="align-items-center">
                      <Col md={5}>
                        <strong>{producto.nombre}</strong>
                      </Col>
                      <Col md={2} className="text-center">
                        x{producto.cantidad}
                      </Col>
                      <Col md={3} className="text-center">
                        ${producto.precio.toLocaleString()}
                      </Col>
                      <Col md={2} className="text-end">
                        <strong>${(producto.precio * producto.cantidad).toLocaleString()}</strong>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}

              <Card className="mt-3 bg-light">
                <Card.Body className="text-center">
                  <h4><strong>Total: ${boletaData.total.toLocaleString()} CLP</strong></h4>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Boleta;