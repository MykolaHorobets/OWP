const moment = require('moment');

const UniversityRepository = require('./../repositories/universityRepository');

const universityRepository = new UniversityRepository('data/universities.json');
const University = require('../models/university');

const config = require('../config');
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: config.cloudinary.cloud_name,
	api_key: config.cloudinary.api_key,
	api_secret: config.cloudinary.api_secret,
});

module.exports = {
	async getUniversities(req, res) {
		console.log(req.query);
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 5;
		const name = req.query.name || '';

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

	postUniversity(req, res) {
		const reqUniversity = JSON.parse(req.body.university);

		const university = new University({
			name: reqUniversity.name,
			country: reqUniversity.country,
			...(reqUniversity.numOfStudents && { numOfStudents: reqUniversity.numOfStudents }),
			...(reqUniversity.campus && { campus: reqUniversity.campus }),
			...(reqUniversity.foundationDate && { foundationDate: reqUniversity.foundationDate }),
			dateAdded: moment().format('MMMM Do YYYY, h:mm:ss a'),
		});

		const imgPromise = new Promise((resolve, reject) => {
			const fileObject = req.files?.image;
			const fileBuffer = fileObject?.data;
			cloudinary.v2.uploader
				.upload_stream({ resource_type: 'raw' }, (error, result) => {
					university.image = result?.url;
					if (error && error.message !== 'Empty file') reject(error);
					resolve(result?.url);
				})
				.end(fileBuffer);
		});
		imgPromise
			.then(url => {
				university.image = url;
				university.save();
			})
			.then(() => res.status(201).json(university))
			.catch(err => {
				console.log('ERROR', err);
				res.status(400).json({ message: 'ERROR: ' + err });
			});
	},

	async deleteUniversity(req, res) {
		try {
			const id = req.params.id;
			console.log(id);
			const university = await University.deleteOne({ _id: id });
			return res.status(200).send(university);
		} catch (err) {
			res.send(400).json({ message: err });
		}
	},
};
