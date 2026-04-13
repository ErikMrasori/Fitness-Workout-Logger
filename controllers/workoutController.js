const workoutModel = require('../models/workoutModel');

const canAccessWorkout = (requestUser, workout) => requestUser.role === 'admin' || workout.user_id === requestUser.id;

const createWorkout = (req, res, next) => {
  const { name, date, user_id: payloadUserId } = req.body;
  const userId = req.user.role === 'admin' && payloadUserId ? Number(payloadUserId) : req.user.id;

  workoutModel.createWorkout(userId, name, date, (err, workoutId) => {
    if (err) return next(err);

    return workoutModel.getWorkoutById(workoutId, (findErr, workout) => {
      if (findErr) return next(findErr);
      return res.status(201).json({ message: 'Workout created successfully.', data: workout });
    });
  });
};

const getWorkouts = (req, res, next) => {
  if (req.user.role === 'admin') {
    return workoutModel.getAllWorkouts((err, workouts) => {
      if (err) return next(err);
      return res.status(200).json({ message: 'Workouts fetched successfully.', data: workouts });
    });
  }

  return workoutModel.getWorkoutsByUser(req.user.id, (err, workouts) => {
    if (err) return next(err);
    return res.status(200).json({ message: 'Workouts fetched successfully.', data: workouts });
  });
};

const getWorkoutById = (req, res, next) => {
  const id = Number(req.params.id);

  workoutModel.getWorkoutById(id, (err, workout) => {
    if (err) return next(err);
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    if (!canAccessWorkout(req.user, workout)) {
      return res.status(403).json({ message: 'Forbidden: cannot access this workout.' });
    }

    return res.status(200).json({ message: 'Workout fetched successfully.', data: workout });
  });
};

const updateWorkoutPut = (req, res, next) => {
  const id = Number(req.params.id);
  const { name, date } = req.body;

  workoutModel.getWorkoutById(id, (findErr, workout) => {
    if (findErr) return next(findErr);
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    if (!canAccessWorkout(req.user, workout)) return res.status(403).json({ message: 'Forbidden.' });

    return workoutModel.updateWorkoutPut(id, name, date, (err, changes) => {
      if (err) return next(err);
      if (!changes) return res.status(404).json({ message: 'Workout not found.' });

      return workoutModel.getWorkoutById(id, (getErr, updatedWorkout) => {
        if (getErr) return next(getErr);
        return res.status(200).json({ message: 'Workout updated successfully.', data: updatedWorkout });
      });
    });
  });
};

const updateWorkoutPatch = (req, res, next) => {
  const id = Number(req.params.id);

  workoutModel.getWorkoutById(id, (findErr, workout) => {
    if (findErr) return next(findErr);
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    if (!canAccessWorkout(req.user, workout)) return res.status(403).json({ message: 'Forbidden.' });

    return workoutModel.updateWorkoutPatch(id, req.body, (err, changes) => {
      if (err && err.message === 'No valid fields to update') {
        return res.status(400).json({ message: err.message });
      }
      if (err) return next(err);
      if (!changes) return res.status(404).json({ message: 'Workout not found.' });

      return workoutModel.getWorkoutById(id, (getErr, updatedWorkout) => {
        if (getErr) return next(getErr);
        return res.status(200).json({ message: 'Workout patched successfully.', data: updatedWorkout });
      });
    });
  });
};

const deleteWorkout = (req, res, next) => {
  const id = Number(req.params.id);

  workoutModel.getWorkoutById(id, (findErr, workout) => {
    if (findErr) return next(findErr);
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    if (!canAccessWorkout(req.user, workout)) return res.status(403).json({ message: 'Forbidden.' });

    return workoutModel.deleteWorkout(id, (err, changes) => {
      if (err) return next(err);
      if (!changes) return res.status(404).json({ message: 'Workout not found.' });
      return res.status(200).json({ message: 'Workout deleted successfully.' });
    });
  });
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkoutPut,
  updateWorkoutPatch,
  deleteWorkout,
};
