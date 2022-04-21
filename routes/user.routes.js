const { Router } = require("express");
const { check } = require("express-validator");
const {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosPatch,
	usuariosDelete,
} = require("../controllers/usuarios.controller");
const { esRolValido } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get("/", usuariosGet);

router.post(
	"/",
	[
		check("nombre", "El nombre es obligatorio").notEmpty(),
		check(
			"password",
			"El password es obligatorio y debe ser de al menos 6 caracteres"
		)
			.notEmpty()
			.isLength({
				min: 6,
			}),
		check("email", "El correo no es válido").isEmail(),
		check("rol").custom(esRolValido),
		validarCampos,
	],
	usuariosPost
);

router.put("/:id", usuariosPut);

router.patch("/", usuariosPatch);

router.delete("/", usuariosDelete);

module.exports = router;
