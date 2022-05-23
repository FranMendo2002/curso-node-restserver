const { response } = require("express");
const { request } = require("express");

const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const obtenerProductos = async (req = request, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = {
		estado: true,
	};
	const [total, productos] = await Promise.all([
		Producto.countDocuments(query),
		Producto.find(query)
			.limit(limite)
			.skip(desde)
			.populate("usuario", "nombre")
			.populate("categoria", "nombre"),
	]);

	return res.json({
		total,
		productos,
	});
};

const obtenerProductoPorId = async (req = request, res = response) => {
	const { id } = req.params;

	const producto = await Producto.findById(id)
		.populate("usuario", "nombre")
		.populate("categoria", "nombre");
	res.json(producto);
};

const crearProducto = async (req = request, res = response) => {
	const {
		nombre,
		categoria,
		precio,
		descripcion = "",
		disponible,
	} = req.body;

	const categoriaProducto = await Categoria.findOne({
		nombre: categoria.toUpperCase(),
	});

	const nuevoProducto = {
		nombre,
		estado: true,
		usuario: req.usuario._id,
		precio,
		categoria: categoriaProducto._id,
		descripcion,
		disponible,
	};

	const producto = new Producto(nuevoProducto);
	await producto.save();

	return res.status(201).json({
		producto,
	});
};

const actualizarProducto = async (req = request, res = response) => {
	const { id } = req.params;
	const { estado, usuario, ...producto } = req.body;
	producto.usuario = req.usuario._id;

	const productoDB = await Producto.findByIdAndUpdate(id, producto, {
		new: true,
	})
		.populate("usuario", "nombre")
		.populate("categoria", "nombre");

	return res.status(200).json(productoDB);
};

const borrarProducto = async (req = request, res = response) => {
	const { id } = req.params;

	const producto = await Producto.findByIdAndUpdate(
		id,
		{
			estado: false,
		},
		{ new: true }
	);

	return res.status(202).json(producto);
};

module.exports = {
	crearProducto,
	obtenerProductos,
	obtenerProductoPorId,
	actualizarProducto,
	borrarProducto,
};
