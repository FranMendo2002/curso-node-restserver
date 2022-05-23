const { Router } = require("express");
const { check } = require("express-validator");
const { buscar } = require("../controllers/buscar.controller");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.get(
	"/:coleccion/:termino",
	[
		check("coleccion", "No existe la colección indicada").notEmpty(),
		check("termino", "El termino de busqueda no es válido").notEmpty(),
		validarCampos,
	],
	buscar
);

module.exports = router;
