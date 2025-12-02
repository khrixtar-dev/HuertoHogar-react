import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { validarLogin } from "../../public/js/validacionesLogin.js";
import { useAuth } from "../context/AuthContext";
import { loginUsuario } from "../api/authApi";
import { setSesion } from "../../public/js/persistenciaLogin";

import "../css/login-clientes.css";

export default function LoginCliente() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const submitCredenciales = async (e) => {
    e.preventDefault();

    const errores = validarLogin(email, password);
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
      const data = await loginUsuario(email, password);
      login(data.token);

      const decoded = jwtDecode(data.token);
      const nombre = decoded.sub?.split("@")[0] || "Usuario";
      const isAdmin = decoded.type === "ADMIN";

      setSesion({
        nombre: nombre,
        correo: email,
        admin: isAdmin,
      });

      window.dispatchEvent(new Event("sesionActualizada"));

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Inicio de sesión exitoso",
        toast: true,
        position: "bottom-center",
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => navigate(isAdmin ? "/admin" : "/"), 1500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "El correo o la contraseña no son válidos.",
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
          className="login-left-cliente d-flex flex-column justify-content-center align-items-center text-center p-5"
        >
          <div className="logo-box mb-4">
            <img
              src="/img/navbar_footer_/LogoHuertoHogar.png"
              alt="Huerto Hogar"
              style={{ width: "120px" }}
            />
          </div>

          <h2 className="fw-bold text-success mb-2">Huerto Hogar</h2>
          <p className="text-muted mb-4">Inicia sesión en tu cuenta</p>

          <Form
            style={{ width: "80%", maxWidth: "400px" }}
            onSubmit={submitCredenciales}
          >
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="w-100 btn-green mb-3">
              INGRESAR
            </Button>

            <p className="small">
              ¿No tienes una cuenta?{" "}
              <Link to="/registro" className="text-success fw-semibold">
                Regístrate
              </Link>
            </p>
          </Form>
        </Col>

        {/* DERECHA */}
        <Col
          md={6}
          className="login-right-cliente d-flex flex-column justify-content-center align-items-center text-center p-5"
        >
          <h3 className="fw-bold mb-3">Más que una comunidad</h3>
          <p className="px-5">
            Únete a Huerto Hogar y disfruta de lo mejor de la tierra 🌱
          </p>
        </Col>
      </Row>
    </Container>
  );
}
