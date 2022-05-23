const { Router } = require("express");
const { check, query } = require("express-validator");
const {
	crearProducto,
	obtenerProductos,
	obtenerProductoPorId,
	actualizarProducto,
	borrarProducto,
} = require("../controllers/productos.controller");
const {
	existeCategoriaProducto,
	existeProductoPorId,
} = require("../helpers/db-validators");
const { validarJWT, validarCampos, tieneRol } = require("../middlewares");

const router = Router();

// Obtener todos los productos - publico
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
	obtenerProductos
);

// Obtener una categoria por id - publico
router.get(
	"/:id",
	[
		check("id", "El id ingresado no es un id de Mongo").isMongoId(),
		validarCampos,
		check("id").custom(existeProductoPorId),
		validarCampos,
	],
	obtenerProductoPorId
);

// Crear un producto - cualquier persona con un token valido
router.post(
	"/",
	[
		validarJWT,
		check("nombre", "El nombre es obligatorio y debe ser de tipo string")
			.notEmpty()
			.isString(),
		check("precio", "El precio debe ser un numero").isNumeric().optional(),
		check("categoria").custom(existeCategoriaProducto),
		check("descripcion").isString().optional(),
		check("disponible").isBoolean().optional(),
		validarCampos,
	],
	crearProducto
);

// Actualizar categoria - cualquier persona con un token valido
router.put(
	"/:id",
	[
		validarJWT,
		check("nombre", "El nombre es obligatorio y debe ser de tipo string")
			.notEmpty()
			.isString()
			.optional(),
		check("precio", "El precio debe ser un numero").isNumeric().optional(),
		check("categoria").custom(existeCategoriaProducto).optional(),
		check("descripcion").isString().optional(),
		check("disponible").isBoolean().optional(),
		check("id", "El id indicado no es valido").isMongoId(),
		validarCampos,
		check("id").custom(existeProductoPorId),
		validarCampos,
	],
	actualizarProducto
);

// Borrar categoria - Admin
router.delete(
	"/:id",
	[
		validarJWT,
		tieneRol("ADMIN_ROLE"),
		check("id", "El id indicado no es valido").isMongoId(),
		validarCampos,
		check("id").custom(existeProductoPorId),
		validarCampos,
	],
	borrarProducto
);

module.exports = router;
