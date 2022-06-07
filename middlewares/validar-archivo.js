const { response } = require("express");
const { request } = require("express");

const validarArchivo = (req = request, res = response, next) => {
	if (
		!req.files ||
		Object.keys(req.files).length === 0 ||
		!req.files.archivo
	) {
		res.status(400).json({
			msg: "No se subieron archivos",
		});
		return;
	}
	next();
};

module.exports = {
	validarArchivo,
};
