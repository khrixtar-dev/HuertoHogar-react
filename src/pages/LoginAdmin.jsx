import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { validarLogin } from "../../public/js/validacionesLogin";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import "../css/login-admin.css";

export default function LoginAdmin() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitCredenciales = async (e) => {
    e.preventDefault();

    // Validar formato
    const errores = validarLogin(correo, contraseña);
    if (errores.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Errores de validación",
        html: errores.map((e) => `• ${e}`).join("<br>"),
        toast: true,
        position: "bottom-center",
        timer: 3500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      // Llamar al backend real
      const resp = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: correo,
          password: contraseña,
        }),
      });

      if (!resp.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await resp.json();
      const token = data.token;

      // Decodificar JWT para validar rol
      const payload = jwtDecode(token);
      const roles = payload.roles || [];

      const esAdmin = roles.some((r) => r.authority === "ADMIN");
      if (!esAdmin) {
        Swal.fire({
          icon: "error",
          title: "Acceso denegado",
          text: "Esta cuenta no tiene permisos de administrador.",
          toast: true,
          position: "bottom-center",
          timer: 2500,
          showConfirmButton: false,
        });
        return;
      }

      // Guardar token
      login(token);

      Swal.fire({
        icon: "success",
        title: "Bienvenido administrador",
        text: "Accediendo al panel...",
        toast: true,
        position: "bottom-center",
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/admin");
      }, 1800);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de acceso",
        text: error.message,
        toast: true,
        position: "bottom-center",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Container fluid className="login-fullscreen p-0">
      <Row className="g-0 vh-100">
        {/* IZQUIERDA */}
        <Col
          md={6}
          className="login-left-admin d-flex flex-column justify-content-center align-items-center text-center p-5"
        >
          <h3 className="fw-bold mb-3">Panel de Administración</h3>
          <p className="px-5">
            Accede para gestionar usuarios, productos y reportes 🌿
          </p>
        </Col>

        {/* DERECHA */}
        <Col
          md={6}
          className="login-right-admin d-flex flex-column justify-content-center align-items-center text-center p-5"
        >
          <div className="logo-box mb-4 d-flex align-items-center justify-content-center">
            <img
              src="/img/navbar_footer_/LogoHuertoHogar.png"
              alt="Huerto Hogar"
              style={{ width: "120px", height: "auto" }}
            />
          </div>

          <h2 className="fw-bold text-success mb-2">Huerto Hogar Admin</h2>
          <p className="text-muted mb-4">Inicia sesión como administrador</p>

          <Form
            style={{ width: "80%", maxWidth: "400px" }}
            onSubmit={submitCredenciales}
          >
            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100 btn-green mb-3">
              INGRESAR
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
