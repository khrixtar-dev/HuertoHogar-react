import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { validarRegistro } from "../../public/js/validacion_registro.js";
import { registrarUsuario } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

import "../css/registro.css";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [repetirContraseña, setRepetirContraseña] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // guardar token

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validaciones
    const errores = validarRegistro(
      nombre,
      apellido,
      correo,
      contraseña,
      repetirContraseña,
      aceptaTerminos
    );

    if (errores.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Errores en el registro",
        html: errores.map((e) => `• ${e}`).join("<br>"),
        toast: true,
        position: "bottom-center",
        timer: 4000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      // 2. Enviar al backend REAL
      const data = await registrarUsuario({
        firstname: nombre,
        lastname: apellido,
        email: correo,
        password: contraseña, // ESTE CAMPO ES CLAVE
      });

      // 3. Guardar token automáticamente
      login(data.token);

      // 4. Swal éxito
      Swal.fire({
        icon: "success",
        title: `¡Bienvenido, ${nombre}!`,
        text: "Tu cuenta ha sido creada e iniciada.",
        toast: true,
        position: "bottom-center",
        timer: 2200,
        showConfirmButton: false,
      });

      // 5. Redirigir al home
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: "El correo ya está registrado o hubo un problema.",
      });
    }
  };

  return (
    <div className="registro-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="registro-card p-4 shadow-lg">
          <h3 className="text-center mb-4 text-success fw-bold">
            Crear cuenta
          </h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Repetir contraseña</Form.Label>
              <Form.Control
                type="password"
                value={repetirContraseña}
                onChange={(e) => setRepetirContraseña(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                label={
                  <>
                    Acepto los{" "}
                    <a href="#" className="text-success">
                      términos del servicio
                    </a>
                  </>
                }
              />
            </Form.Group>

            <Button type="submit" className="w-100 btn-green mb-3">
              Registrarse
            </Button>

            <p className="text-center small">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login_cliente" className="text-success fw-semibold">
                Inicia sesión aquí
              </Link>
            </p>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
