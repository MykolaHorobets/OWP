const { Router } = require('express');
const router = Router();

const universityController = require('../controllers/universityController');

/**
 * Get all universities
 * @route GET /api/universities
 * @group Universities - university operations
 * @returns {Array.<University>} University - all universities
 */
router.get('/', universityController.getUniversities);

/**
 * Get university by id
 * @route GET /api/universities/{id}
 * @group Universities - university operations
 * @param {string} id.path.required - id of the University
 * @returns {University.model} 200 - University object
 * @returns {Error} 404 - University not found
 */
router.get('/:id', universityController.getUniversity);

/**
 * Post new university
 * @route POST /api/universities
 * @group Universities - university operations
 * @param {University.model} university.body.required - new University object
 * @returns {University.model} 201 - added University object
 */
router.post('/', universityController.postUniversity);

/**
 * Put university
 * @route PUT /api/universities/{id}
 * @group Universities - university operations
 *
 * @param {string} id.path.required - id of the University
 * @param {University.model} university.body.required - new University object
 * @returns {University.model} 200 - changed University object
 * @returns {Error} 404 - University not found
 */
router.put('/:id', universityController.putUniversity);

/**
 * Delete university
 * @route DELETE /api/universities/{id}
 * @group Universities - university operations
 * @param {string} id.path.required - id of the University
 * @returns {University.model} 200 - deleted University object
 * @returns {Error} 404 - University not found
 */
router.delete('/:id', universityController.deleteUniversity);

module.exports = router;
