const { Router } = require('express');
const router = Router();

const userController = require('../controllers/userController');

router.get('/', userController.getUsers);

router.get(`/:id`, userController.getUser);

module.exports = router;
