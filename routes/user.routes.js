const { Router } = require("express");
const { check, query } = require("express-validator");
const {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosPatch,
	usuariosDelete,
} = require("../controllers/usuarios.controller");
const {
	esRolValido,
	emailExiste,
	usuarioExiste,
} = require("../helpers/db-validators");
const {
	validarCampos,
	validarJWT,
	esAdminRol,
	tieneRol,
} = require("../middlewares");

const router = Router();

router.get(
	"/",
	[
		query("limite", "El valor de 'limite' debe ser numérico")
			.isNumeric()
			.optional(),
		query("desde", "El valor de 'desde' debe ser numérico")
			.isNumeric()
			.optional(),
		validarCampos,
	],
	usuariosGet
);

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
		check("email").custom(emailExiste),
		check("rol").custom(esRolValido),
		validarCampos,
	],
	usuariosPost
);

router.put(
	"/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(usuarioExiste),
		validarCampos,
	],
	usuariosPut
);

router.patch("/", usuariosPatch);

router.delete(
	"/:id",
	[
		validarJWT,
		// esAdminRol,
		tieneRol("ADMIN_ROLE", "VENTAS_ROLE"),
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(usuarioExiste),
		validarCampos,
	],
	usuariosDelete
);

module.exports = router;
