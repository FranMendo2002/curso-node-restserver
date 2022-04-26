const { response } = require("express");
const { request } = require("express");
const jwt = require("jsonwebtoken");
const usuario = require("../models/usuario");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
	const token = req.header("x-token");
	if (!token) {
		return res.status(401).json({
			msg: "No existe token en la petición",
		});
	}
	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
		// Leer el usuario que corresponde al uid
		const usuarioAutenticado = await Usuario.findById(uid);
		if (!usuarioAutenticado) {
			return res.status(401).json({
				msg: "Token no válido --> Usuario no existe en DB",
			});
		}
		// Verificar si el usuario tiene estado en true
		if (!usuarioAutenticado.estado) {
			return res.status(401).json({
				msg: "Token no válido --> Usuario con estado false",
			});
		}
		usuarioAutenticado;
		req.usuario = usuarioAutenticado;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
			msg: "Token no válido",
		});
	}
};

module.exports = {
	validarJWT,
};
