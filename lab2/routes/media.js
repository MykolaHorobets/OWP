const { Router } = require('express');
const mediaController = require('../controllers/mediaController');
const router = Router();

/**
 * Post an image
 * @route POST /api/media
 * @group Media - upload and get images
 * @consumes multipart/form-data
 * @param {file} image.formData.required - uploaded image
 * @returns {integer} 200 - added image id
 */
router.post('/', mediaController.apiPostMedia);

/**
 * Get an image
 * @route GET /api/media/{id}
 * @group Media - upload and get images
 * @param {string} id.path.required - id of the Image
 * @consumes multipart/form-data
 * @returns {integer} 200 - get Image
 * @returns {Error} 404 - Image not found
 */
router.get('/:id', mediaController.apiGetMedia);

module.exports = router;
