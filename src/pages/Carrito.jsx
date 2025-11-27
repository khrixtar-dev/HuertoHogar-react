import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PRODUCTOS } from "../../public/js/productos_catalogo";
import {
  obtenerCarrito,
  agregarAlCarrito,
  quitarDelCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
} from "../../public/js/carrito";
import { obtenerUsuarioActual, cuentaIniciada } from "../../public/js/persistenciaLogin";
import Swal from "sweetalert2";
import "../css/carrito.css";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [productosCarrito, setProductosCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = () => {
    const carritoItems = obtenerCarrito();
    setCarrito(carritoItems);

    const productos = carritoItems.map((item) => {
      let producto = null;
      PRODUCTOS.forEach((p) => {
        if (p.id === item.id) {
          producto = p;
        }
      });
      return { ...producto, cantidad: item.cantidad };
    });
    setProductosCarrito(productos);
  };

  const manejarAgregarProducto = (id) => {
    agregarAlCarrito(id);
    cargarCarrito();
  };

  const manejarRestarProducto = (id) => {
    quitarDelCarrito(id);
    cargarCarrito();
  };

  const manejarEliminarProducto = (id) => {
    eliminarDelCarrito(id);
    cargarCarrito();
  };

  const calcularCantidadTotal = () => {
    return productosCarrito.reduce(
      (total, producto) => total + producto.cantidad,
      0
    );
  };

  const calcularTotal = () => {
    return productosCarrito.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0
    );
  };

  const manejarPago = () => {
    // Generar datos de la boleta
    const boletaData = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString('es-CL'),
      productos: productosCarrito.map(p => ({
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precio
      })),
      total: calcularTotal(),
      usuarioId: cuentaIniciada() ? obtenerUsuarioActual().correo : null
    };

    // Guardar en localStorage si el usuario está logueado
    if (cuentaIniciada()) {
      const tickets = localStorage.getItem('tickets');
      const ticketsArray = tickets ? JSON.parse(tickets) : [];
      ticketsArray.push(boletaData);
      localStorage.setItem('tickets', JSON.stringify(ticketsArray));
    }

    Swal.fire({
      icon: "success",
      title: "¡Compra realizada con éxito!",
      text: "Tu pedido ha sido procesado correctamente",
      toast: true,
      position: "bottom-center",
      timer: 2000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      vaciarCarrito();
      navigate('/boleta', { state: { boletaData } });
    }, 2000);
  };

  // SI EL CARRITO ESTA VACIO
  if (productosCarrito.length === 0) {
    return (
      <Container className="carrito-vacio">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <h2 className="text-white mb-4">Tu carrito está vacío</h2>
            <p className="text-white">
              Puedes agregar productos desde nuestra tienda
            </p>
            <Button variant="success" href="/tienda">
              Ir a la Tienda
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  // SI EL CARRITO TIENE PRODUCTOS
  return (
    <Container className="carrito-container">
      <h2 className="text-white mb-4">Mi Carrito</h2>

      <Row>
        <Col lg={8}>
          <Card className="productos-card">
            <Card.Header>
              <h5>Productos ({calcularCantidadTotal()} items)</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {productosCarrito.map((producto) => (
                <div key={producto.id} className="producto-item">
                  <Row className="align-items-center">
                    <Col xs={3} md={2}>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="producto-imagen"
                      />
                    </Col>
                    <Col xs={9} md={4}>
                      <h6 className="producto-nombre">{producto.nombre}</h6>
                      <p className="producto-id">ID: {producto.id}</p>
                      <p className="producto-precio">
                        ${producto.precio.toLocaleString()} CLP/kg
                      </p>
                    </Col>
                    <Col xs={12} md={3} className="cantidad-controls">
                      <div className="cantidad-wrapper">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => manejarRestarProducto(producto.id)}
                        >
                          -
                        </Button>
                        <span className="cantidad">{producto.cantidad}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => manejarAgregarProducto(producto.id)}
                        >
                          +
                        </Button>
                      </div>
                    </Col>
                    <Col xs={6} md={2}>
                      <p className="subtotal">
                        $
                        {(producto.precio * producto.cantidad).toLocaleString()}
                      </p>
                    </Col>
                    <Col xs={6} md={1}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => manejarEliminarProducto(producto.id)}
                      >
                        ×
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        {/*LADO DERECHO*/}
        <Col lg={4}>
          <Card className="resumen-card">
            <Card.Header>
              <h5>Resumen de Compra</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {productosCarrito.map((producto) => (
                  <ListGroup.Item key={producto.id} className="resumen-item">
                    <div className="d-flex justify-content-between">
                      <span className="producto-resumen">
                        {producto.nombre} x{producto.cantidad}
                      </span>
                      <span>
                        $
                        {(producto.precio * producto.cantidad).toLocaleString()}
                      </span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <hr />

              <div className="total-section">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${calcularTotal().toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="total-precio">
                    ${calcularTotal().toLocaleString()} CLP
                  </strong>
                </div>
              </div>
              <Button 
                variant="success" 
                size="lg" 
                className="w-100 btn-pagar"
                onClick={manejarPago}
              >
                Ir a Pagar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Carrito;
