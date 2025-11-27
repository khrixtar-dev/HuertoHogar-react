import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuarioActual, cuentaIniciada } from '../../public/js/persistenciaLogin';
import '../css/cuenta.css';

function Cuenta() {
  const usuario = obtenerUsuarioActual();
  const navigate = useNavigate();
  return (
    <Container className="cuenta-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="cuenta-card">
            <Card.Header className="cuenta-header">
              <h3>Detalle de cuenta</h3>
            </Card.Header>
            <Card.Body className="cuenta-body">
              <div className="text-center">
                <div className="cuenta-avatar">
                  <span className="cuenta-avatar-text">
                    {usuario.nombre[0]?.toUpperCase()}
                  </span>
                </div>
              </div>

              <Row className="cuenta-info-row">
                <Col><strong>ID de usuario:</strong></Col>
                <Col>{usuario.id}</Col>
              </Row>
              
              <Row className="cuenta-info-row">
                <Col><strong>Nombre:</strong></Col>
                <Col>{usuario.nombre}</Col>
              </Row>

              <Row className="cuenta-info-row">
                <Col><strong>Apellido:</strong></Col>
                <Col>{usuario.apellido}</Col>
              </Row>

              <Row className="cuenta-info-row">
                <Col><strong>Correo:</strong></Col>
                <Col>{usuario.correo}</Col>
              </Row>

              <Row className="cuenta-info-row">
                <Col><strong>Tipo de cuenta:</strong></Col>
                <Col>
                  <span>
                    {usuario.admin ? 'Administrador' : 'Cliente'}
                  </span>
                </Col>
              </Row>
              <div className="text-center mt-4">
                <Button 
                  variant="success" 
                  onClick={() => navigate('/mis-compras')}
                >
                  Ver mis compras
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Cuenta;