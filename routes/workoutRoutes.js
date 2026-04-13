const express = require('express');
const workoutController = require('../controllers/workoutController');
const authenticate = require('../middleware/authMiddleware');
const validateBody = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/', workoutController.getWorkouts);
router.get('/:id', workoutController.getWorkoutById);
router.post('/', validateBody(['name', 'date']), workoutController.createWorkout);
router.put('/:id', validateBody(['name', 'date']), workoutController.updateWorkoutPut);
router.patch('/:id', workoutController.updateWorkoutPatch);
router.delete('/:id', workoutController.deleteWorkout);

module.exports = router;
