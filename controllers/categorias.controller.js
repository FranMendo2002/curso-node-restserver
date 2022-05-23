const { response } = require("express");
const { request } = require("express");
const Categoria = require("../models/categoria");

const obtenerCategorias = async (req = request, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = {
		estado: true,
	};
	const [total, categorias] = await Promise.all([
		Categoria.countDocuments(query),
		Categoria.find(query)
			.limit(limite)
			.skip(desde)
			.populate("usuario", "nombre"),
	]);

	return res.json({
		total,
		categorias,
		msg: "Obtener todas las categorias",
	});
};

const obtenerCategoriaPorId = async (req = request, res = response) => {
	const { id } = req.params;
	const categoriaDB = await Categoria.findById(id).populate(
		"usuario",
		"nombre"
	);
	res.json(categoriaDB);
};

const crearCategoria = async (req = request, res = response) => {
	const nombre = req.body.nombre.toUpperCase();

	const categoriaDB = await Categoria.findOne({ nombre });

	if (categoriaDB) {
		return res
			.status(400)
			.json({ msg: `La categoria ${nombre} ya existe` });
	}

	// Generar la data a guardar
	const data = {
		nombre,
		usuario: req.usuario._id,
	};

	const categoria = new Categoria(data);

	// Guardar DB
	await categoria.save();

	res.json(categoria).status(201);
};

const actualizarCategoria = async (req = request, res = response) => {
	const { id } = req.params;
	const { estado, usuario, ...categoria } = req.body;
	categoria.nombre = categoria.nombre.toUpperCase();
	categoria.usuario = req.usuario._id;
	const categoriaDB = await Categoria.findByIdAndUpdate(id, categoria, {
		new: true,
	}).populate("usuario", "nombre");

	return res.status(200).json(categoriaDB);
};

const borrarCategoria = async (req = request, res = response) => {
	const { id } = req.params;

	const categoria = await Categoria.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }
	).populate();

	return res.status(202).json(categoria);
};

module.exports = {
	crearCategoria,
	obtenerCategorias,
	obtenerCategoriaPorId,
	actualizarCategoria,
	borrarCategoria,
};
