const express = require("express");
require("dotenv").config();
const cors = require("cors");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.usuariosPath = "/api/usuarios";

		// Middlewares
		this.middlewares();

		// Rutas de mi aplicacion
		this.routes();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Hay que configurar un middleware para que reciba datos de formato tipo JSON. Lectura y parseo del body
		this.app.use(express.json());

		// Directorio publico
		this.app.use(express.static("public"));
	}

	routes() {
		this.app.use(this.usuariosPath, require("../routes/user.routes"));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("Servidor corriendo en el puerto ", this.port);
		});
	}
}

module.exports = Server;
