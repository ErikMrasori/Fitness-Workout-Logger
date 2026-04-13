const logModel = require('../models/logModel');
const workoutModel = require('../models/workoutModel');

const canAccessLog = (requestUser, log) => requestUser.role === 'admin' || log.user_id === requestUser.id;

const createLog = (req, res, next) => {
  const { workout_id: workoutId, exercise_id: exerciseId, reps, sets } = req.body;

  return workoutModel.getWorkoutById(Number(workoutId), (workoutErr, workout) => {
    if (workoutErr) return next(workoutErr);
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    if (req.user.role !== 'admin' && workout.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    return logModel.createLog(workoutId, exerciseId, reps, sets, (err, logId) => {
      if (err) return next(err);

      return logModel.getLogById(logId, (findErr, log) => {
        if (findErr) return next(findErr);
        return res.status(201).json({ message: 'Log created successfully.', data: log });
      });
    });
  });
};

const getLogs = (req, res, next) => {
  if (req.user.role === 'admin') {
    return logModel.getAllLogs((err, logs) => {
      if (err) return next(err);
      return res.status(200).json({ message: 'Logs fetched successfully.', data: logs });
    });
  }

  return logModel.getLogsByUser(req.user.id, (err, logs) => {
    if (err) return next(err);
    return res.status(200).json({ message: 'Logs fetched successfully.', data: logs });
  });
};

const getLogById = (req, res, next) => {
  const id = Number(req.params.id);

  logModel.getLogById(id, (err, log) => {
    if (err) return next(err);
    if (!log) return res.status(404).json({ message: 'Log not found.' });
    if (!canAccessLog(req.user, log)) return res.status(403).json({ message: 'Forbidden.' });

    return res.status(200).json({ message: 'Log fetched successfully.', data: log });
  });
};

const updateLogPut = (req, res, next) => {
  const id = Number(req.params.id);
  const { workout_id: workoutId, exercise_id: exerciseId, reps, sets } = req.body;

  logModel.getLogById(id, (findErr, log) => {
    if (findErr) return next(findErr);
    if (!log) return res.status(404).json({ message: 'Log not found.' });
    if (!canAccessLog(req.user, log)) return res.status(403).json({ message: 'Forbidden.' });

    return logModel.updateLogPut(id, workoutId, exerciseId, reps, sets, (err, changes) => {
      if (err) return next(err);
      if (!changes) return res.status(404).json({ message: 'Log not found.' });

      return logModel.getLogById(id, (getErr, updatedLog) => {
        if (getErr) return next(getErr);
        return res.status(200).json({ message: 'Log updated successfully.', data: updatedLog });
      });
    });
  });
};

const updateLogPatch = (req, res, next) => {
  const id = Number(req.params.id);

  logModel.getLogById(id, (findErr, log) => {
    if (findErr) return next(findErr);
    if (!log) return res.status(404).json({ message: 'Log not found.' });
    if (!canAccessLog(req.user, log)) return res.status(403).json({ message: 'Forbidden.' });

    return logModel.updateLogPatch(id, req.body, (err, changes) => {
      if (err && err.message === 'No valid fields to update') {
        return res.status(400).json({ message: err.message });
      }
      if (err) return next(err);
      if (!changes) return res.status(404).json({ message: 'Log not found.' });

      return logModel.getLogById(id, (getErr, updatedLog) => {
        if (getErr) return next(getErr);
        return res.status(200).json({ message: 'Log patched successfully.', data: updatedLog });
      });
    });
  });
};

const deleteLog = (req, res, next) => {
  const id = Number(req.params.id);

  logModel.getLogById(id, (findErr, log) => {
    if (findErr) return next(findErr);
    if (!log) return res.status(404).json({ message: 'Log not found.' });
    if (!canAccessLog(req.user, log)) return res.status(403).json({ message: 'Forbidden.' });

    return logModel.deleteLog(id, (err, changes) => {
      if (err) return next(err);
      if (!changes) return res.status(404).json({ message: 'Log not found.' });
      return res.status(200).json({ message: 'Log deleted successfully.' });
    });
  });
};

module.exports = {
  createLog,
  getLogs,
  getLogById,
  updateLogPut,
  updateLogPatch,
  deleteLog,
};
