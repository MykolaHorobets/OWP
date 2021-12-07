const UserRepository = require('./../repositories/userRepository');

const userRepository = new UserRepository('data/users.json');

module.exports = {
  getUsers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const users = userRepository.getUsers();
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

  getUser(req, res) {
    const user = userRepository.getUsers().find(u => u.uuid === req.params.id);
    if (!user) res.status(404).send('No user found for this ID');
    res.send(user);
  },
};
