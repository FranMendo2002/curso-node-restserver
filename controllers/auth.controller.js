const { response } = require("express");
const { request } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const { DefaultTransporter } = require("google-auth-library");

const login = async (req = request, res = response) => {
	try {
		const { email, password } = req.body;
		// Verificar si el email existe
		const usuario = await Usuario.findOne({ email });
		if (!usuario) {
			return res.status(400).json({
				msg: "Usuario/password no son correctos --> correo",
			});
		}
		// Verificar si el usuario está activo
		if (!usuario.estado) {
			return res.status(400).json({
				msg: "Usuario inactivo",
			});
		}
		// Verificar la contraseña
		const validPassword = bcrypt.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: "Password incorrecto",
			});
		}
		// Generar el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			msg: "login ok",
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "Hable con el administrador",
		});
	}
};

const googleSignIn = async (req = request, res = response) => {
	const { id_token } = req.body;

	try {
		const { nombre, imagen, email } = await googleVerify(id_token);
		let usuario = await Usuario.findOne({ email });
		if (!usuario) {
			// Tengo que crearlo
			const data = {
				nombre,
				email,
				password: "hola",
				imagen,
				google: true,
			};
			usuario = new Usuario(data);
			await usuario.save();
		}
		// Si el usuario en DB
		if (!usuario.estado) {
			return res.status(401).json({
				msg: "Hable con el administrador, usuario bloqueado",
			});
		}
		const token = await generarJWT(usuario.id);
		res.json({
			msg: "Todo ok! Google Sign-in",
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);

		return res.status(400).json({
			msg: "Token de Google no es válido",
			ok: false,
		});
	}
};

module.exports = {
	login,
	googleSignIn,
};
