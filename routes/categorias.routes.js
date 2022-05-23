const { Router } = require("express");
const { validarCampos } = require("../middlewares/validar-campos");
const { check, query } = require("express-validator");
const { request } = require("express");
const { response } = require("express");
const { validarJWT, tieneRol } = require("../middlewares");
const {
	crearCategoria,
	obtenerCategorias,
	obtenerCategoriaPorId,
	actualizarCategoria,
	borrarCategoria,
} = require("../controllers/categorias.controller");
const {
	categoriaExiste,
	categoriaExistePorNombre,
} = require("../helpers/db-validators");

const router = Router();

// url/api/categorias

// Obtener todas las categorias - publico
router.get(
	"/",
	[
		query("limite", "El limite debe ser un valor numerico")
			.isNumeric()
			.optional(),
		query("desde", "El desde debe ser un valor numerico")
			.isNumeric()
			.optional(),
		validarCampos,
	],
	obtenerCategorias
);

// Obtener una categoria por id - publico
router.get(
	"/:id",
	[
		check("id", "El id indicado no es un id de Mongo").isMongoId(),
		check("id").custom(categoriaExiste),
		validarCampos,
	],
	obtenerCategoriaPorId
);

// Crear categoria - cualquier persona con un token valido
router.post(
	"/",
	[
		validarJWT,
		check("nombre", "El nombre es obligatorio").notEmpty(),
		validarCampos,
	],
	crearCategoria
);

// Actualizar categoria - cualquier persona con un token valido
router.put(
	"/:id",
	[
		validarJWT,
		check("nombre", "El nombre es obligatorio").notEmpty(),
		check("nombre").custom(categoriaExistePorNombre),
		check("id", "El id indicado no es valido").isMongoId(),
		check("id").custom(categoriaExiste),
		validarCampos,
	],
	actualizarCategoria
);

// Borrar categoria - Admin
router.delete(
	"/:id",
	[
		validarJWT,
		tieneRol("ADMIN_ROLE"),
		check("id", "El id indicado no es valido").isMongoId(),
		validarCampos,
		check("id").custom(categoriaExiste),
		validarCampos,
	],
	borrarCategoria
);

module.exports = router;
