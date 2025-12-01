import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { getProductos } from '../api/productApi';
import { agregarAlCarrito } from '../../public/js/carrito';
import ProductModal from './ProductModal';
import '../css/home.css';

function ProductCard({ producto, onVerProducto, onAgregarCarrito }) {
  return (
    <Card className="home-product-card">
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

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productosAleatorios, setProductosAleatorios] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await getProductos();
      const aleatorios = data.sort(() => Math.random() - 0.5).slice(0, 4);
      setProductosAleatorios(aleatorios);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const verProductoModal = (id) => {
    const producto = productosAleatorios.find(p => p.id === id);
    setProductoSeleccionado(producto);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setProductoSeleccionado(null);
  };

  const agregarCarritoModal = (id) => {
    agregarAlCarrito(id);
    console.log('Producto agregado al carrito:', id);
  };

  return (
    <div className="w-100 overflow-hidden">
      <div className="w-100">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/img/home_/img_carrusel1.webp"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>Frescura del campo a tu hogar</h3>
              <p>Más de 6 años llevando calidad y sabor a las familias de Chile</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/img/home_/img_carrusel2.webp"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>Estamos cerca de ti</h3>
              <p>Operamos en más de 9 puntos del país: Santiago, Puerto Montt,
                Concepción y más</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/img/home_/img_carrusel3.webp"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Vive saludable y natural</h3>
              <p>Promovemos una alimentación consciente y productos de calidad</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/img/home_/img_carrusel4.webp"
              alt="Fourth slide"
            />
            <Carousel.Caption>
              <h3>Confianza y cercanía</h3>
              <p>Del agricultor directo a tu mesa, con el cariño del campo chileno</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      <Container className="my-5">
        <h3 className="text-center text-white mb-4">
          Productos Recomendados
        </h3>
        <Row>
          {productosAleatorios.map(producto => (
            <Col key={producto.id} xs={6} md={3} className="mb-4 d-flex justify-content-center">
              <ProductCard
                producto={producto}
                onVerProducto={verProductoModal}
                onAgregarCarrito={agregarCarritoModal}
              />
            </Col>
          ))}
        </Row>
      </Container>
      
      <div className="about-container">
        <h3>
          Acerca de HuertoHogar
        </h3>
        <p>
          En HuertoHogar, nos dedicamos a llevar la frescura del campo directamente a tu hogar.
          Con más de 6 años de experiencia, nos enorgullece ofrecer productos agrícolas de alta calidad,
          cultivados con métodos sostenibles y respetuosos con el medio ambiente.
          Nuestra misión es promover una alimentación saludable y consciente, conectando a las familias
          con los agricultores locales y sus productos frescos.
          Desde 2019, hemos trabajado en colaboración con agricultores locales y proveedores de
          confianza para garantizar que cada producto que ofrecemos cumpla con los más altos estándares de calidad.
          Nos esforzamos por ser un referente en la industria agrícola, brindando a nuestros clientes
          una experiencia de compra excepcional y productos que reflejen el sabor auténtico del campo chileno.
        </p>
      </div>
      
      {productoSeleccionado && (
        <ProductModal
          show={showModal}
          onHide={cerrarModal}
          producto={productoSeleccionado}
          onAgregarCarrito={agregarCarritoModal}
        />
      )}
    </div>
  )
}

export default Home;
