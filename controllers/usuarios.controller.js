const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");

const usuariosGet = async (req = request, res = response) => {
	// const { nombre = "sin nombre", apellido = "sin apellido" } = req.query;
	const { limite = 5, desde = 0 } = req.query;
	const query = {
		estado: true,
	};

	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments(query),
		Usuario.find(query).limit(limite).skip(desde),
	]);

	res.json({
		msg: "get /api - controlador",
		total,
		usuarios,
	});
};

const usuariosPost = async (req = request, res = response) => {
	const { nombre, email, password, rol } = req.body;

	const usuario = new Usuario({
		nombre,
		email,
		password,
		rol,
	});

	// Encriptar la contraseña
	const salt = bcrypt.genSaltSync();
	usuario.password = bcrypt.hashSync(password, salt);

	// Guardar en DB
	await usuario.save();

	res.status(201).json({
		usuario,
	});
};

const usuariosPut = async (req = request, res = response) => {
	const { id } = req.params;
	const { _id, password, google, email, ...usuario } = req.body;

	// TODO: validar con bd
	if (password) {
		// Encriptar la contraseña
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);
	}

	const usuarioDB = await Usuario.findByIdAndUpdate(id, usuario, {
		new: true,
	});

	res.status(200).json({
		msg: "put /api - controlador",
		usuarioDB,
	});
};

const usuariosPatch = (req = request, res = response) => {
	res.status(201).json({
		msg: "patch /api - controlador",
	});
};

const usuariosDelete = async (req = request, res = response) => {
	const { id } = req.params;

	// Borrado físico
	// const usuario = await Usuario.findByIdAndDelete(id);

	// Borrado lógico
	const usuario = await Usuario.findByIdAndUpdate(
		id,
		{ estado: false },
		{ new: true }
	);
	const usuarioAutenticado = req.usuario;

	res.json({
		msg: "delete /api - controlador",
		usuario,
		usuarioAutenticado,
	});
};

module.exports = {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosPatch,
	usuariosDelete,
};
