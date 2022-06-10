const { response } = require("express");
const { request } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");

const { Usuario, Producto } = require("../models");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const path = require("path");
const fs = require("fs");

const cargarArchivo = async (req = request, res = response) => {
	try {
		// Txt, md
		const extensionesPermitidas = ["txt", "md"];
		const nombre = await subirArchivo(
			req.files,
			extensionesPermitidas,
			"textos"
		);

		return res.status(200).json({
			nombre,
		});
	} catch (error) {
		return res.status(400).json({
			error,
		});
	}
};

const actualizarImagen = async (req = request, res = response) => {
	const { coleccion, id } = req.params;

	let modelo;
	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});
			}
			break;
		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({
				msg: "Se me olvido validar esto",
			});
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		// Hay que borrar la imagen del servidor
		const pathImagen = path.join(
			__dirname,
			"../uploads/",
			coleccion,
			modelo.img
		);
		if (fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);
	}

	modelo.img = await subirArchivo(req.files, undefined, coleccion);
	await modelo.save();

	res.json(modelo);
};

const actualizarImagenCloudinary = async (req = request, res = response) => {
	const { coleccion, id } = req.params;

	let modelo;
	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});
			}
			break;
		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({
				msg: "Se me olvido validar esto",
			});
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		// TODO: borrar la imagen del servidor
		const nombreArr = modelo.img.split("/"); // Porque esta guardada la url, y en la URL la ultima parte dps de la barra es el nombre
		const nombreImg = nombreArr[nombreArr.length - 1];
		const [public_id] = nombreImg.split("."); // Separo el nombre de la extension .jpg, etc

		await cloudinary.uploader.destroy(public_id);
	}

	const { tempFilePath } = req.files.archivo;
	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
	modelo.img = secure_url;

	await modelo.save();

	res.json(modelo);
};

const traerImagen = async (req = request, res = response) => {
	const { coleccion, id } = req.params;

	let modelo;
	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});
			}
			break;
		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({
				msg: "Se me olvido validar esto",
			});
	}

	// Enviar imágen
	if (modelo.img) {
		// Hay que borrar la imagen del servidor
		const pathImagen = path.join(
			__dirname,
			"../uploads/",
			coleccion,
			modelo.img
		);
		if (fs.existsSync(pathImagen)) {
			return res.sendFile(pathImagen);
		}
	}

	const pathImagen = path.join(__dirname, "../assets/no-image.jpg");

	return res.sendFile(pathImagen);
};

module.exports = {
	cargarArchivo,
	actualizarImagen,
	traerImagen,
	actualizarImagenCloudinary,
};
