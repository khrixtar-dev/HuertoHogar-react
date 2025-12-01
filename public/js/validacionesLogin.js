/**
 * ===============================
 * VALIDACIONES DE LOGIN (FORMATO)
 * ===============================
 */

export function validarCorreo(correo) {
  if (!correo) return "El correo es obligatorio.";
  if (correo.length > 100)
    return "El correo no puede superar los 100 caracteres.";
  return null;
}

export function validarContraseña(pass) {
  if (!pass) return "La contraseña es obligatoria.";
  if (pass.length < 4 || pass.length > 10)
    return "La contraseña debe tener entre 4 y 10 caracteres.";
  return null;
}

export function validarLogin(correo, contraseña) {
  const errores = [];

  const errorCorreo = validarCorreo(correo);
  const errorPass = validarContraseña(contraseña);

  if (errorCorreo) errores.push(errorCorreo);
  if (errorPass) errores.push(errorPass);

  return errores;
}
