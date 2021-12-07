const University = require('../models/university');
const JsonStorage = require('../jsonStorage');

class UniversityRepository {
	constructor(filePath) {
		this.storage = new JsonStorage(filePath);
	}

	getUniversities() {
		return this.storage.readItems();
	}

	getUniversityByUuid(uuid) {
		for (const item of this.storage.readItems()) {
			if (item.uuid === uuid) {
				return new University(item.uuid, item.name, item.country, item.numOfStudents, item.campus, item.foundationDate, item.unImage);
			}
		}
		console.log('This uuid is missing');
		return null;
	}

	addUniversity(universityModel) {
		this.storage.writeItems(universityModel);
	}

	updateUniversity(universityModel) {
		this.storage.writeItems(universityModel);
	}

	deleteUniversity(universityUuid) {
		const items = this.getUniversities();
		items.splice(universityUuid, 1);
		this.storage.writeItems(items);
	}
}

module.exports = UniversityRepository;
