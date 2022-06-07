const { response } = require("express");
const { request } = require("express");

const validarColeccion = (coleccionesPermitidas = []) => {
	return (req = request, res = response, next) => {
		const { coleccion } = req.params;
		if (!coleccionesPermitidas.includes(coleccion)) {
			return res.status(400).json({
				msg: `La colección ${coleccion} no es permitida`,
			});
		}

		next();
	};
};

module.exports = {
	validarColeccion,
};
