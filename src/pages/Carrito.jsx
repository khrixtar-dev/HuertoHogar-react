import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import {
  obtenerCarrito,
  agregarAlCarrito,
  quitarDelCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
} from "../../public/js/carrito";

import {
  obtenerUsuarioActual,
  cuentaIniciada,
} from "../../public/js/persistenciaLogin";
import { getProductos } from "../api/productApi";

import Swal from "sweetalert2";
import "../css/carrito.css";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [productosBD, setProductosBD] = useState([]);
  const [productosCarrito, setProductosCarrito] = useState([]);
  const navigate = useNavigate();

  // Cargar productos BD una vez
  useEffect(() => {
    const cargarProductosBD = async () => {
      try {
        const productos = await getProductos();
        setProductosBD(productos);
      } catch (error) {
        console.error("Error cargando productos desde BD:", error);
      }
    };

    cargarProductosBD();
  }, []);

  // Cargar carrito + escuchar cambios
  useEffect(() => {
    const actualizarCarrito = () => {
      const items = obtenerCarrito();
      setCarrito(items);
    };

    actualizarCarrito();
    window.addEventListener("carritoActualizado", actualizarCarrito);

    return () => {
      window.removeEventListener("carritoActualizado", actualizarCarrito);
    };
  }, []);

  // Merge carrito + productosBD
  useEffect(() => {
    if (!carrito.length || !productosBD.length) {
      setProductosCarrito([]);
      return;
    }

    const productos = carrito
      .map((item) => {
        const p = productosBD.find((prod) => prod.id === item.id);
        if (!p) return null;

        return {
          ...p,
          nombre: p.name,
          precio: p.price,
          imagen: p.urlImage,
          cantidad: item.cantidad,
        };
      })
      .filter(Boolean);

    setProductosCarrito(productos);
  }, [carrito, productosBD]);

  // Acciones
  const manejarAgregarProducto = (id) => agregarAlCarrito(id);
  const manejarRestarProducto = (id) => quitarDelCarrito(id);
  const manejarEliminarProducto = (id) => eliminarDelCarrito(id);

  // Totales
  const calcularCantidadTotal = () =>
    productosCarrito.reduce((total, p) => total + p.cantidad, 0);

  const calcularTotal = () =>
    productosCarrito.reduce(
      (total, p) => total + Number(p.precio || 0) * p.cantidad,
      0
    );

  // Crear ticket y detalles
  const manejarPago = async () => {
    const boletaData = {
      purchaseDate: new Date().toISOString(),
      total: calcularTotal(),
      items: productosCarrito.map((producto) => ({
        productId: producto.id,
        amount: producto.cantidad,
        price: producto.precio,
        subtotal: producto.precio * producto.cantidad,
      })),
    };

    console.log("Enviando pago:", boletaData);
    console.log("Token:", localStorage.getItem("authToken"));

    try {
      // 1) Enviar ticket (junto con los detalles) al backend
      const response = await fetch("http://localhost:8080/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Incluir el token JWT
        },
        body: JSON.stringify(boletaData), // Enviar ticket completo
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const ticket = await response.json(); // Recibir respuesta del ticket creado

      // 2) Confirmación de compra
      Swal.fire({
        icon: "success",
        title: "¡Compra realizada con éxito!",
        text: "Tu pedido ha sido procesado correctamente.",
        toast: true,
        position: "bottom-center",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        vaciarCarrito();
        navigate("/boleta", { state: { boletaData: ticket } });
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: error.message || "No se pudo procesar la compra, por favor intenta nuevamente.",
      });
    }
  };

  // Carrito vacío
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

  // Render principal
  return (
    <Container className="carrito-container">
      <h2 className="text-white mb-4">Mi Carrito</h2>

      <Row>
        {/* IZQUIERDA: lista de productos */}
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
                      <p className="producto-precio">
                        ${Number(producto.precio || 0).toLocaleString()} CLP
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
                        {(
                          Number(producto.precio || 0) * producto.cantidad
                        ).toLocaleString()}
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

        {/* DERECHA: resumen */}
        <Col lg={4}>
          <Card className="resumen-card">
            <Card.Header>
              <h5>Resumen de Compra</h5>
            </Card.Header>

            <Card.Body>
              <ListGroup variant="flush">
                {productosCarrito.map((p) => (
                  <ListGroup.Item key={p.id} className="resumen-item">
                    <div className="d-flex justify-content-between">
                      <span>
                        {p.nombre} x{p.cantidad}
                      </span>
                      <span>
                        ${(Number(p.precio || 0) * p.cantidad).toLocaleString()}
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
