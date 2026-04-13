const express = require('express');
const logController = require('../controllers/logController');
const authenticate = require('../middleware/authMiddleware');
const validateBody = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/', logController.getLogs);
router.get('/:id', logController.getLogById);
router.post('/', validateBody(['workout_id', 'exercise_id', 'reps', 'sets']), logController.createLog);
router.put('/:id', validateBody(['workout_id', 'exercise_id', 'reps', 'sets']), logController.updateLogPut);
router.patch('/:id', logController.updateLogPatch);
router.delete('/:id', logController.deleteLog);

module.exports = router;
