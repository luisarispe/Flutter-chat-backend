const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "EL correo ya esta registrado",
      });
    }
    const usuario = new Usuario(req.body);

    //ENCRIPTAR CONTRASEÑA
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    //GENERAR MI JWT
    const token = await generarJWT(usuario.id);

    return res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "El email/contraseña no encontrado",
      });
    }

    //VALIDAMOS EL PASSWORD
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "El email/contraseña no encontrado",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuarioDB.id);
    return res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const renewToken = async (req, res) => {
  try {
    const uid = req.uid;
    const token = await generarJWT(uid);
    const usuario = await Usuario.findById({ _id: uid });

    res.json({
      ok: true,
      token,
      msg: req.uid,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  crearUsuario,
  Login,
  renewToken,
};
