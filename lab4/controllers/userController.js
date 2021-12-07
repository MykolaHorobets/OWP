const UserRepository = require('./../repositories/userRepository');

const userRepository = new UserRepository();

module.exports = {
	async getUsers(req, res) {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 3;

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const users = await userRepository.getUsers();

		const results = {};

		if (startIndex > 0) {
			results.previous = {
				page: page - 1,
				limit: limit,
			};
		}
		if (endIndex < users.length) {
			results.next = {
				page: page + 1,
				limit: limit,
			};
		}

		results.results = users.slice(startIndex, endIndex);
		res.send(results);
	},

	async getUser(req, res) {
		const user = await userRepository.getUserById(req.params.id);
		if (!user) res.send({ fullname: "This user doesn't exist" });
		else res.send(user);
	},
};
