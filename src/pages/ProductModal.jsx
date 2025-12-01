import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { agregarAlCarrito } from '../../public/js/carrito';


function ProductModal({ show, onHide, producto, onAgregarCarrito }) {
  if (producto === null || producto === undefined) {
    return null;
  }

  const modalAgregarCarrito = () => {
    onAgregarCarrito(producto.id);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{producto.name}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div className="text-center mb-3">
          <img 
            src={producto.urlImage} 
            alt={producto.name}
            style={{ maxWidth: '100%', height: '200px', objectFit: 'cover' }}
          />
        </div>
        
        <div>
          <p><strong>Código:</strong> {producto.id}</p>
          <p><strong>Precio:</strong> ${producto.price ? producto.price.toLocaleString() : 'N/A'} CLP/kg</p>
          <p><strong>Descripción:</strong> {producto.description || 'Sin descripción'}</p>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="success" onClick={modalAgregarCarrito}>
          Agregar al Carrito
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductModal;
