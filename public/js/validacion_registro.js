export function validarRegistro(
  nombre,
  apellido,
  correo,
  contraseña,
  repetirContraseña,
  aceptaTerminos
) {
  const errores = [];

  // Validar nombre
  if (!nombre.trim()) errores.push("El nombre es obligatorio.");
  else if (nombre.length < 2) errores.push("El nombre es demasiado corto.");

  // Validar apellido
  if (!apellido.trim()) errores.push("El apellido es obligatorio.");
  else if (apellido.length < 2) errores.push("El apellido es demasiado corto.");

  // Validar correo
  if (!correo.trim()) errores.push("El correo es obligatorio.");
  else {
    const regex = /^[\w._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!regex.test(correo))
      errores.push(
        "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com."
      );
  }

  // Validar contraseña
  if (!contraseña) errores.push("La contraseña es obligatoria.");
  else if (contraseña.length < 4 || contraseña.length > 10)
    errores.push("La contraseña debe tener entre 4 y 10 caracteres.");

  // Confirmar contraseña
  if (contraseña !== repetirContraseña)
    errores.push("Las contraseñas no coinciden.");

  // Términos
  if (!aceptaTerminos)
    errores.push("Debes aceptar los Términos de servicio para continuar.");

  return errores; // devolvemos errores (si hay)
}
