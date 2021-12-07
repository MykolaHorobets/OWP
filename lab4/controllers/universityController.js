const UniversityRepository = require('./../repositories/universityRepository');

const universityRepository = new UniversityRepository('data/universities.json');
const University = require('../models/university');

module.exports = {
	async getUniversities(req, res) {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const name = req.query.name;

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const rawUniversities = await universityRepository.getUniversities();
		const universities = rawUniversities.filter(un => un.name.toUpperCase().includes(name.toUpperCase()));

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

	async getUniversity(req, res) {
		const university = await universityRepository.getUniversityById(req.params.id);
		if (!university) res.send({ name: "This university doesn't exist" });
		else res.send(university);
	},

	async postUniversity(req, res) {
		const university = new University({
			name: req.body.name || res.status(400).send(`name not entered`),
			country: req.body.country || res.status(400).send(`country not entered`),
			numOfStudents: req.body.numOfStudents,
			campus: req.body.campus,
			foundationDate: req.body.foundationDate,
			image: req.body.image,
		});
		const universities = await universityRepository.getUniversities();
		universities.push(university);
		universityRepository.addUniversity(universities);
		res.status(201).send(university);
	},

	async putUniversity(req, res) {
		const universities = await universityRepository.getUniversities();
		const requiredId = universities.findIndex(university => university._id === req.params.id);
		if (requiredId === -1) res.status(404).send('No university found for this ID');
		else {
			universities.requiredId.name = req.body.name || universities.requiredId.name;
			universities.requiredId.country = req.body.country || universities.requiredId.country;
			universities.requiredId.numOfStudents = req.body.numOfStudents || universities.requiredId.numOfStudents;
			universities.requiredId.campus = req.body.campus || universities.requiredId.campus;
			universities.requiredId.foundationDate = req.body.foundationDate || universities.requiredId.foundationDate;
			universities.requiredId.image = req.body.image || universities.requiredId.image;

			universityRepository.updateUniversity(universities);
			res.send(universities.requiredId);
		}
	},

	deleteUniversity(req, res) {
		const universities = universityRepository.getUniversities();
		const requiredId = universities.findIndex(university => university._id === req.params.id);
		if (requiredId === -1) res.status(404).send('No university found for this ID');
		else {
			const university = universities.requiredId;
			universityRepository.deleteUniversity(requiredId);
			res.send(university);
		}
	},
};
