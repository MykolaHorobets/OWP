require('dotenv').config();

module.exports = {
	mongodbUri: process.env.MONGODB_URI,
	cloudinary: {
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.API_KEY,
		api_secret: process.env.API_SECRET,
	},
	port: process.env.PORT || 3000,
};
