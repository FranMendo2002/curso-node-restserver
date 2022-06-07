const { Router } = require("express");
const { check } = require("express-validator");
const {
	cargarArchivo,
	actualizarImagen,
	traerImagen,
	actualizarImagenCloudinary,
} = require("../controllers/uploads.controller");
const { validarArchivo } = require("../middlewares/validar-archivo");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarColeccion } = require("../middlewares/validar-coleccion");

const router = Router();

router.post("/", [validarArchivo, validarCampos], cargarArchivo);

router.put(
	"/:coleccion/:id",
	[
		check("id", "El id debe ser un id de Mongo").isMongoId(),
		validarColeccion(["usuarios", "productos"]),
		validarArchivo,
		validarCampos,
	],
	// actualizarImagen
	actualizarImagenCloudinary
);

router.get(
	"/:coleccion/:id",
	[
		check("id", "El id debe ser un id de Mongo").isMongoId(),
		validarColeccion(["usuarios", "productos"]),
		validarCampos,
	],
	traerImagen
);

module.exports = router;
