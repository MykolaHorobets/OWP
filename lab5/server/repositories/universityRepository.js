const University = require('../models/university');

class UniversityRepository {
	getUniversities() {
		return University.find();
	}

	getUniversityById(id) {
		return University.findById(id);
	}
}

module.exports = UniversityRepository;
