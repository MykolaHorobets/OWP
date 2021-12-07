const { Schema, model } = require('mongoose');

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	numOfStudents: Number,
});

module.exports = model('Specialty', schema);
