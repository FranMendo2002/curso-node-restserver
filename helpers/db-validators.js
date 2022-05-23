const Role = require("../models/role");
const Usuario = require("../models/usuario");
const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

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

const categoriaExiste = async id => {
	const categoriaExiste = await Categoria.findById(id);
	if (!categoriaExiste) {
		throw new Error("No existe ninguna categoria con el id indicado");
	}
};

const categoriaExistePorNombre = async nombre => {
	nombre = nombre.toUpperCase();
	const categoriaExiste = await Categoria.findOne({ nombre });
	if (categoriaExiste) {
		throw new Error(`La categoria indicada ya tiene el nombre ${nombre}`);
	}
};

const existeCategoriaProducto = async (nombreCategoria = "") => {
	nombreCategoria = nombreCategoria.toUpperCase();
	const categoriaExiste = await Categoria.findOne({
		nombre: nombreCategoria,
	});
	if (!categoriaExiste) {
		throw new Error(`La categoría ingresada no fue encontrada`);
	}
};

const existeProductoPorId = async id => {
	const producto = await Producto.findById(id);
	if (!producto) {
		throw new Error(`No existe un producto con el id ${id}`);
	}
};

module.exports = {
	esRolValido,
	emailExiste,
	usuarioExiste,
	categoriaExiste,
	categoriaExistePorNombre,
	existeCategoriaProducto,
	existeProductoPorId,
};
