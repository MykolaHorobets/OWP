const { Router } = require('express');
const router = Router();

const Specialty = require('../models/specialty');

router.get('/', async (_, res) => {
	const specialties = await Specialty.find().lean();

	res.render('specialty/specialties', {
		title: 'Specialties',
		isSpecialties: true,
		specialties,
	});
});

router.get('/new', (_, res) => {
	res.render('specialty/newSpecialty', {
		title: 'Create new university',
	});
});

router.post('/new', async (req, res) => {
	const specialty = new Specialty({
		name: req.body.name,
		...(req.body.numOfStudents && { numOfStudents: req.body.numOfStudents }),
	});

	await specialty.save();

	res.status(201).redirect(`/specialties/${specialty._id}`);
});

router.get('/:id', async (req, res) => {
	const specialty = (await Specialty.findById(req.params.id).lean()) || {};

	res.render('specialty/specialty', {
		title: specialty.name,
		specialty,
	});
});

router.post('/:id', async (req, res) => {
	if (req.body._method === 'DELETE') {
		await Specialty.deleteOne({ _id: req.body.id });
		res.status(200).redirect('/specialties');
	} else if (req.body._method === 'UPDATE') {
		const specialty = new Specialty({
			_id: req.body.id,
			name: req.body.name,
			numOfStudents: req.body.numOfStudents,
		});

		await Specialty.findOneAndUpdate({ _id: req.body.id }, specialty);
		res.status(204).send();
	}
});

module.exports = router;
