const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth.controller");
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

router.post(
	"/google",
	[
		check("id_token", "Token de Google es necesario").notEmpty(),
		validarCampos,
	],
	googleSignIn
);

module.exports = router;
