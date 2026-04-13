const express = require('express');
const authController = require('../controllers/authController');
const validateBody = require('../middleware/validateMiddleware');

const router = express.Router();

router.post('/register', validateBody(['username', 'password']), authController.register);
router.post('/login', validateBody(['username', 'password']), authController.login);

module.exports = router;
