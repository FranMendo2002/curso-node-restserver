const Role = require("../models/role");
const usuario = require("../models/usuario");
const Usuario = require("../models/usuario");

const esRolValido = async (rol = "") => {
	const existeRol = await Role.findOne({ rol });
	if (!existeRol) {
		throw new Error(`El rol ${rol} no existe en la base de datos`);
	}
};

const emailExiste = async email => {
	const emailExiste = await Usuario.findOne({ email });
	if (emailExiste) {
		throw new Error("El email ingresado ya está registrado");
	}
};

const usuarioExiste = async id => {
	const usuarioExiste = await Usuario.findById(id);
	if (!usuarioExiste) {
		throw new Error("El id del usuario ingresado no se encontró");
	}
};

module.exports = {
	esRolValido,
	emailExiste,
	usuarioExiste,
};
