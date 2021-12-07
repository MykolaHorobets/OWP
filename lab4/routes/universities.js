const { Router } = require('express');
const router = Router();

const PORT = process.env.PORT || 3000;
const http = require('http');

const University = require('../models/university');
const Specialty = require('../models/specialty');

const config = require('../config');
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: config.cloudinary.cloud_name,
	api_key: config.cloudinary.api_key,
	api_secret: config.cloudinary.api_secret,
});

router.get('/', (req, res) => {
	const name = req.query.name;
	const currentPage = req.query.page || 1;
	http.get(`http://localhost:${PORT}/api/universities?page=${currentPage}&name=${name || ''}`, async apiRes => {
		apiRes.setEncoding('utf8');
		let rawData = '';
		await apiRes.on('data', chunk => {
			rawData += chunk;
		});
		const universities = JSON.parse(rawData);

		universities.page = [...Array(universities.numOfPages + 1).keys()].slice(1);

		res.render('university/universities', {
			title: 'Universities',
			isUniversities: true,
			universities,
			name,
			currentPage,
		});
	});
});

router.get('/new', async (_, res) => {
	const specialties = await Specialty.find().lean();

	res.render('university/newUniversity', {
		title: 'Create new university',
		specialties,
	});
});

router.post('/new', (req, res) => {
	const university = new University({
		name: req.body.name,
		country: req.body.country,
		...(req.body.numOfStudents && { numOfStudents: req.body.numOfStudents }),
		...(req.body.campus && { campus: req.body.campus }),
		...(req.body.foundationDate && { foundationDate: req.body.foundationDate }),
		specialty: req.body.specialty,
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
		.then(() => res.status(201).redirect(`/universities/${university._id}`))
		.catch(err => {
			console.log('ERROR', err);
			res.status(400).redirect('/universities');
		});
});

router.get('/:id', (req, res) => {
	http.get(`http://localhost:${PORT}/api/universities/${req.params.id}`, async apiRes => {
		apiRes.setEncoding('utf8');
		let rawData = '';
		await apiRes.on('data', chunk => {
			rawData += chunk;
		});
		const university = JSON.parse(rawData);

		const { name: specialtyName = '' } = (await Specialty.findById(university.specialty)) || {};

		res.render('university/university', {
			title: university.name,
			university,
			specialtyName,
		});
	});
});

router.post('/:id', async (req, res) => {
	await University.deleteOne({ _id: req.body.id });

	res.status(200).redirect('/universities');
});

module.exports = router;
