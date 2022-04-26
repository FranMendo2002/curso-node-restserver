const { response } = require("express");
const { request } = require("express");

const esAdminRol = (req = request, res = response, next) => {
	if (!req.usuario) {
		res.status(500).json({
			msg: "Se quiere verificar el rol sin validar el token primero",
		});
	}

	const { rol, nombre } = req.usuario;
	if (rol !== "ADMIN_ROLE") {
		res.status(401).json({
			msg: `${nombre} no es administrador - No tiene permisos para realizar esto`,
		});
	}

	next();
};

const tieneRol = (...roles) => {
	return (req = request, res = response, next) => {
		if (!req.usuario) {
			res.status(500).json({
				msg: "Se quiere verificar el rol sin validar el token primero",
			});
		}

		if (!roles.includes(req.usuario.rol)) {
			res.status(401).json({
				msg: `El servicio requiere uno de estos roles: ${roles}`,
			});
		}
		next();
	};
};

module.exports = {
	esAdminRol,
	tieneRol,
};
