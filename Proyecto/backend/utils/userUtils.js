function mapUserResponse(row) {
  if (!row) return row;

  return {
    id: row.rut,
    nombre: row.nombre,
    apellido_paterno: row.apellido_paterno,
    apellido_materno: row.apellido_materno,
    nacimiento: row.nacimiento,
    rut: row.rut,
    email: row.email,
    telefono: row.telefono,
    direccion: row.direccion,
    paymentMethod: row.card_last4
      ? {
          last4: row.card_last4,
          brand: row.card_brand || undefined,
          expiry: row.card_expiry || undefined
        }
      : null
  };
}

