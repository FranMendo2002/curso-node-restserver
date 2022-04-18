const mongoose = require("mongoose");
require("colors");

const dbConnectionn = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_CNN, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Base de datos conectada".bgGreen.black);
	} catch (error) {
		console.log(error);
		throw new Error("Error al iniciar base de datos");
	}
};

module.exports = {
	dbConnectionn,
};
