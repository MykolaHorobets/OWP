const { Schema, model } = require('mongoose');

const schema = new Schema({
	login: {
		type: String,
		required: true,
	},
	fullname: {
		type: String,
		default: 'Anonymous',
	},
	role: {
		type: Number,
		default: 0,
	},
	registeredAt: {
		type: Date,
		default: Date.now(),
	},
	avaUrl: {
		type: String,
	},
	isEnabled: {
		type: Boolean,
		default: true,
	},
	universities: {
		type: [String],
		validate: v => Array.isArray(v) && v.length > 0,
	},
});

module.exports = model('User', schema);
