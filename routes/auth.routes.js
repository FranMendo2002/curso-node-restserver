const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth.controller");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
	"/login",
	[
		check("email", "El email es requerido").isEmail(),
		check("password", "La contraseña es obligatoria").not().isEmpty(),
		validarCampos,
	],
	login
);

module.exports = router;
