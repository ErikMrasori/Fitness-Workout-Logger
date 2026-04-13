const express = require('express');
const exerciseController = require('../controllers/exerciseController');
const authenticate = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const validateBody = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/', exerciseController.getExercises);
router.get('/:id', exerciseController.getExerciseById);
router.post('/', authorizeRoles('admin'), validateBody(['name', 'muscle_group']), exerciseController.createExercise);
router.put('/:id', authorizeRoles('admin'), validateBody(['name', 'muscle_group']), exerciseController.updateExercisePut);
router.patch('/:id', authorizeRoles('admin'), exerciseController.updateExercisePatch);
router.delete('/:id', authorizeRoles('admin'), exerciseController.deleteExercise);

module.exports = router;
