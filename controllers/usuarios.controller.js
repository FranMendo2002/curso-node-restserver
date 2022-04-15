const { response, request } = require("express");

const usuariosGet = (req = request, res = response) => {
	const { nombre = "sin nombre", apellido = "sin apellido" } = req.query;

	res.json({
		msg: "get /api - controlador",
		nombre,
		apellido,
	});
};

const usuariosPost = (req = request, res = response) => {
	const { nombre, edad } = req.body;

	res.status(400).json({
		msg: "post /api - controlador",
		nombre,
		edad,
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
