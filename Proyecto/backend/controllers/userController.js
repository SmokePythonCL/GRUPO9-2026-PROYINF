exports.getProfile = async (req, res) => {
  const q = await pool.query(
    "SELECT rut, nombre, apellido_paterno, apellido_materno, nacimiento, rut, email, telefono, direccion, card_last4, card_brand, card_expiry FROM users WHERE rut=$1",
    [req.user.rut]
  );
  res.json(mapUserResponse(q.rows[0]));
};

exports.updateProfile = async (req, res) => {
  try {
    const userRut = req.user.rut;

    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      nacimiento,
      email,
      telefono,
      direccion
    } = req.body;

    const fields = [];
    const values = [];

    function addField(fieldName, fieldValue) {
      if (fieldValue !== undefined) {
        fields.push(`${fieldName} = $${fields.length + 1}`);
        values.push(fieldValue);
      }
    }

    addField("nombre", nombre);
    addField("apellido_paterno", apellido_paterno);
    addField("apellido_materno", apellido_materno);
    addField("nacimiento", nacimiento);
    addField("email", email);
    addField("telefono", telefono);
    addField("direccion", direccion);

    if (fields.length === 0)
      return res.status(400).json({ error: "No hay datos para actualizar." });

    // Validar email repetido solo si se intenta cambiar
    if (email !== undefined) {
      const exist = await pool.query(
        "SELECT rut FROM users WHERE email=$1 AND rut<>$2",
        [email, userRut]
      );

      if (exist.rows.length > 0)
        return res.status(409).json({ error: "Email ya registrado por otro usuario." });
    }

    // Construcción del UPDATE dinámico
    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE rut = $${fields.length + 1}
      RETURNING rut, nombre, apellido_paterno, apellido_materno, nacimiento, rut as id, email, telefono, direccion, card_last4, card_brand, card_expiry
    `;

    values.push(userRut);

    const updated = await pool.query(query, values);

    res.json(mapUserResponse(updated.rows[0]));

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Error interno" });
  }
};



exports.updatePaymentMethod = async (req, res) => {
  try {
    const userRut = req.user.rut;
    const { cardNumber, expiry, cvv } = req.body || {};

    const digits = String(cardNumber || '').replace(/\D/g, '');
    const safeExpiry = String(expiry || '').trim();
    const safeCvv = String(cvv || '').replace(/\D/g, '');

    if (digits.length < 12 || digits.length > 19 || !isLuhnValid(digits)) {
      return res.status(400).json({ error: 'Número de tarjeta inválido.' });
    }

    if (!/^\d{2}\/\d{2}$/.test(safeExpiry)) {
      return res.status(400).json({ error: 'Fecha de expiración inválida. Usa MM/AA.' });
    }

    const month = Number(safeExpiry.slice(0, 2));
    if (month < 1 || month > 12) {
      return res.status(400).json({ error: 'Mes de expiración inválido.' });
    }

    if (safeCvv.length < 3 || safeCvv.length > 4) {
      return res.status(400).json({ error: 'CVV inválido.' });
    }

    const last4 = digits.slice(-4);
    const brand = detectCardBrand(digits);

    const q = await pool.query(
      `UPDATE users
       SET card_last4=$1, card_brand=$2, card_expiry=$3
       WHERE rut=$4
       RETURNING card_last4, card_brand, card_expiry`,
      [last4, brand, safeExpiry, userRut]
    );

    res.json({
      ok: true,
      paymentMethod: {
        last4: q.rows[0].card_last4,
        brand: q.rows[0].card_brand,
        expiry: q.rows[0].card_expiry
      }
    });
  } catch (err) {
    console.error('UPDATE PAYMENT METHOD ERROR:', err);
    res.status(500).json({ error: 'Error interno' });
  }
};
exports.creditHistory = authMiddleware, (req, res) => {
  // Parsing numbers out of rut to seed
  const numSeed = parseInt(req.user.rut.replace(/\D/g, '')) || 12345;
  const seed = (numSeed * 97) % 600;
  const score = 300 + seed;
  let risk = 'ALTO';
  let recommendedAmount = 1000000;
  
  if (score >= 700) {
    risk = 'BAJO';
    recommendedAmount = 7000000;
  } else if (score >= 500) {
    risk = 'MEDIO';
    recommendedAmount = 3500000;
  }
  
  res.json({
    score,
    risk,
    recommendedAmount,
    debts: (numSeed * 12345) % 1000000,
    reportDate: new Date().toISOString()
  });
};