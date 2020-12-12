const Usuario = require("../models/usuario");

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const usuario = await Usuario.find({ _id: { $ne: req.uid } })
    .sort("-online")
    .skip(desde)
    .limit(200);
  try {
    res.status(200).json({
      ok: true,
      usuario,
    });
  } catch (error) {}
};

module.exports = {
  getUsuarios,
};
