const { Router } = require('express');
const router = Router();

const userController = require('../controllers/userController');

/**
 * Get all users
 * @route GET /api/users
 * @group Users - user operations
 * @returns {Array.<User>} User - all users
 */
router.get('/', userController.getUsers);

/**
 * Get user by id
 * @route GET /api/users/{id}
 * @group Users - user operations
 * @param {string} id.path.required - id of the User
 * @returns {User.model} 200 - User object
 * @returns {Error} 404 - User not found
 */
router.get(`/:id`, userController.getUser);

module.exports = router;
