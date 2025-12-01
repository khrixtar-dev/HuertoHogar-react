import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { getProductos } from '../api/productApi';
import { agregarAlCarrito } from '../../public/js/carrito';
import ProductModal from './ProductModal';
import '../css/tienda.css';

function ProductCard({ producto, onVerProducto, onAgregarCarrito }) {
  return (
    <Card className="product-card">
      <Card.Img variant="top" src={producto.urlImage} alt={producto.name} />
      <Card.Body>
        <Card.Title>
          {producto.name}
        </Card.Title>
        <Card.Text>
          ${producto.price ? producto.price.toLocaleString() : 'N/A'} CLP/kg
        </Card.Text>
        <div className="btn-container">
          <Button className="btn-ver-producto" size="sm" variant="success" onClick={
            () => onVerProducto(producto.id)
          }>
            Ver Producto
          </Button>
          <Button className="btn-agregar" size="sm" variant="success" onClick={
            () => onAgregarCarrito(producto.id)
          }>
            Añadir al Carro
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

function Tienda() {
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
      
      const categoriasUnicas = [...new Set(data.map(p => p.categoryName))];
      setCategorias(categoriasUnicas);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const productosFiltrados = filtroCategoria 
    ? productos.filter(p => p.categoryName === filtroCategoria)
    : productos;

  const VerProducto = (id) => {
    const producto = productos.find(p => p.id === id);
    setProductoSeleccionado(producto);
    setShowModal(true);
  };

  const CerrarModal = () => {
    setShowModal(false);
    setProductoSeleccionado(null);
  };

  const AgregarCarrito = (id) => {
    agregarAlCarrito(id);
    console.log('Producto agregado al carrito:', id);
  };

  return (
    <>
      <Container>
        <h2 className="my-4 tienda-title">
          Catalogo
        </h2>

        <Row className="mb-4">
          <Col md={4}>
            <Form.Select className='form-select'
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">
                Todas las categorías
              </option>
              {categorias.map(categoria => {
                const nombreCategoria = categoria.replace(/_/g, ' ');
                return (
                  <option key={categoria} value={categoria}>
                    {nombreCategoria.charAt(0).toUpperCase() + nombreCategoria.slice(1)}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {productosFiltrados.map(producto => (
            <Col key={producto.id} xs={6} md={3} className="mb-4 d-flex justify-content-center">
              <ProductCard
                producto={producto}
                onVerProducto={VerProducto}
                onAgregarCarrito={AgregarCarrito}
              />
            </Col>
          ))}
        </Row>

        {productoSeleccionado && (
          <ProductModal
            show={showModal}
            onHide={CerrarModal}
            producto={productoSeleccionado}
            onAgregarCarrito={AgregarCarrito}
          />
        )}
      </Container>
    </>
  );
}

export default Tienda
