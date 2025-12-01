import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

import { validarLogin } from "../../public/js/validacionesLogin";
import { useAuth } from "../context/AuthContext";
import { loginUsuario } from "../api/authApi";
import { setSesion } from "../../public/js/persistenciaLogin";

import "../css/login-admin.css";

export default function LoginAdmin() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitCredenciales = async (e) => {
    e.preventDefault();

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
      const data = await loginUsuario(correo, contraseña);
      const decoded = jwtDecode(data.token);

      const esAdmin = decoded.type === "ADMIN";
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

      login(data.token);

      const nombre = decoded.sub?.split("@")[0] || "Administrador";
      setSesion({
        nombre: nombre,
        correo: correo,
        admin: true,
      });

      window.dispatchEvent(new Event("sesionActualizada"));

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: "Accediendo...",
        toast: true,
        position: "bottom-center",
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 1800);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de acceso",
        text: "Credenciales incorrectas",
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
