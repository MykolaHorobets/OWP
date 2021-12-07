const { Router } = require('express');
const router = Router();

const universityController = require('../controllers/universityController');

router.get('/', universityController.getUniversities);

router.get('/:id', universityController.getUniversity);

router.post('/', universityController.postUniversity);

router.put('/:id', universityController.putUniversity);

router.delete('/:id', universityController.deleteUniversity);

module.exports = router;
