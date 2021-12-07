const UniversityRepository = require('./../repositories/universityRepository');
const uuidv4 = require('uuid-v4');

const universityRepository = new UniversityRepository('data/universities.json');
const University = require('../models/university');

module.exports = {
	getUniversities(req, res) {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const name = req.query.name;

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const universities = universityRepository.getUniversities().filter(university => university.name.toUpperCase().includes(name.toUpperCase()));
		// console.log(universities);

		const results = {};

		const numOfPages = Math.ceil(universities.length / limit);
		results.numOfPages = numOfPages;
		results.limit = limit;

		if (startIndex > 0) {
			results.previous = {
				page: page - 1,
			};
		}
		if (endIndex < universities.length) {
			results.next = {
				page: page + 1,
			};
		}

		results.results = universities.slice(startIndex, endIndex);
		res.send(results);
	},

	getUniversity(req, res) {
		const university = universityRepository.getUniversities().find(u => u.uuid === req.params.id);
		if (!university) res.status(404).send('No university found for this ID');
		res.send(university);
	},

	postUniversity(req, res) {
		const university = new University(
			req.body['uuid'] || uuidv4(),
			req.body['name'] || res.status(400).send(`name not entered`),
			req.body['country'] || res.status(400).send(`country not entered`),
			req.body['numOfStudents'],
			req.body['campus'],
			req.body['foundationDate'],
			req.body['unImage']
		);
		const universities = universityRepository.getUniversities();
		universities.push(university);
		universityRepository.addUniversity(universities);
		res.status(201).send(university);
	},

	putUniversity(req, res) {
		const universities = universityRepository.getUniversities();
		const requiredUuid = universities.findIndex(university => university.uuid === req.params.id);
		if (requiredUuid === -1) res.status(404).send('No university found for this ID');
		else {
			universities[requiredUuid].name = req.body['name'] || universities[requiredUuid].name;
			universities[requiredUuid].country = req.body['country'] || universities[requiredUuid].country;
			universities[requiredUuid].numOfStudents = req.body['numOfStudents'] || universities[requiredUuid].numOfStudents;
			universities[requiredUuid].campus = req.body['campus'] || universities[requiredUuid].campus;
			universities[requiredUuid].foundationDate = req.body['foundationDate'] || universities[requiredUuid].foundationDate;
			universities[requiredUuid].unImage = req.body['unImage'] || universities[requiredUuid].unImage;

			universityRepository.updateUniversity(universities);
			res.send(universities[requiredUuid]);
		}
	},

	deleteUniversity(req, res) {
		const universities = universityRepository.getUniversities();
		const requiredUuid = universities.findIndex(university => university.uuid === req.params.id);
		if (requiredUuid === -1) res.status(404).send('No university found for this ID');
		else {
			const university = universities[requiredUuid];
			universityRepository.deleteUniversity(requiredUuid);
			res.send(university);
		}
	},
};
