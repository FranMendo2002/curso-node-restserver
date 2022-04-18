const { Schema, model } = require("mongoose");
const Usuario = require("../models/usuario");

const UsuarioSchema = Schema({
	nombre: {
		type: String,
		required: [true, "El nombre es obligatorio"],
	},
	email: {
		type: String,
		required: [true, "El correo es obligatorio"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "La contraseña es obligatoria"],
	},
	google: {
		type: Boolean,
		default: false,
	},
	img: {
		type: String,
	},
	rol: {
		type: String,
		required: true,
		enum: ["ADMIN_ROLE", "USER_ROLE", "VENTAS_ROLE"],
	},
	estado: {
		type: Boolean,
		default: true,
	},
});

module.exports = model("Usuario", UsuarioSchema);
