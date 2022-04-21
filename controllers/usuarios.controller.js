const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");

const usuariosGet = (req = request, res = response) => {
	const { nombre = "sin nombre", apellido = "sin apellido" } = req.query;

	res.json({
		msg: "get /api - controlador",
		nombre,
		apellido,
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

	// Verificar si el correo existe
	const existeEmail = await Usuario.findOne({ email });
	if (existeEmail) {
		return res.status(400).json({
			error: "El correo ya está registrado",
		});
	}

	// Encriptar la contraseña
	const salt = bcrypt.genSaltSync();
	usuario.password = bcrypt.hashSync(password, salt);

	// Guardar en DB
	await usuario.save();

	res.status(201).json({
		usuario,
	});
};

const usuariosPut = (req = request, res = response) => {
	const { id } = req.params;
	console.log("id: ", id);

	res.status(201).json({
		msg: "put /api - controlador",
		id,
	});
};

const usuariosPatch = (req = request, res = response) => {
	res.status(201).json({
		msg: "patch /api - controlador",
	});
};

const usuariosDelete = (req = request, res = response) => {
	res.json({
		msg: "delete /api - controlador",
	});
};

module.exports = {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosPatch,
	usuariosDelete,
};
