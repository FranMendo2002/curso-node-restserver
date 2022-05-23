const { response } = require("express");
const { request } = require("express");

const { Usuario, Categoria, Producto } = require("../models");

const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = ["usuarios", "categoria", "productos", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const usuario = await Usuario.findById(termino);
		return res.status(200).json({
			results: usuario ? [usuario] : [],
		});
	}

	const regex = new RegExp(termino, "i");

	const usuarios = await Usuario.find({
		$or: [
			{
				nombre: regex,
			},
			{
				email: regex,
			},
			{
				rol: regex,
			},
		],
		$and: [{ estado: true }],
	});

	return res.status(200).json({
		results: usuarios,
	});
};

const buscarCategorias = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const categoria = await Categoria.findById(termino);
		return res.status(200).json({
			results: categoria ? [categoria] : [],
		});
	}

	const regex = new RegExp(termino, "i");

	const categorias = await Categoria.find({
		$and: [{ estado: true }, { nombre: regex }],
	});

	return res.status(200).json({
		results: categorias,
	});
};

const buscarProductos = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const producto = await Producto.findById(termino)
			.populate("usuario", "nombre")
			.populate("categoria", "nombre");
		return res.status(200).json({
			results: producto ? [producto] : [],
		});
	}

	const regex = new RegExp(termino, "i");

	const productos = await Producto.find({
		$and: [{ estado: true }],
		$or: [{ nombre: regex }, { descripcion: regex }],
	})
		.populate("usuario", "nombre")
		.populate("categoria", "nombre");

	return res.status(200).json({
		results: productos,
	});
};

const buscar = (req = request, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: "La colección indicada no es válida",
		});
	}

	switch (coleccion) {
		case "usuarios":
			buscarUsuarios(termino, res);
			break;
		case "categoria":
			buscarCategorias(termino, res);
			break;
		case "productos":
			buscarProductos(termino, res);
			break;
		case "roles":
			break;
		default:
			return res.status(500).json({
				msg: `Busqueda todavia no creada, contacte a su administrador: ${coleccion}`,
			});
	}
};

module.exports = { buscar };
