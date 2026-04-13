const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const validateBody = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authenticate, authorizeRoles('admin'));

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', validateBody(['username', 'role']), userController.updateUserPut);
router.patch('/:id', userController.updateUserPatch);
router.delete('/:id', userController.deleteUser);

module.exports = router;
