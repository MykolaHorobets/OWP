const { Schema, model } = require('mongoose');

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	numOfStudents: Number,
	campus: Number,
	foundationDate: String,
	image: String,
	specialty: {
		type: String,
		required: true,
	},
});

module.exports = model('University', schema);
