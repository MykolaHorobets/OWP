const User = require('../models/user');

class UserRepository {
	getUsers() {
		return User.find();
	}

	getUserById(id) {
		return User.findById(id);
	}
}

module.exports = UserRepository;
