/*
    path:api/login
*/

const { Router } = require("express");

const { validarJWT } = require("../middlewares/validar-jwt");
const Usuario = require("../controllers/usuarios");
const router = Router();

router.get("/", validarJWT, Usuario.getUsuarios);

module.exports = router;
