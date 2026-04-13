const exerciseModel = require('../models/exerciseModel');

const createExercise = (req, res, next) => {
  const { name, muscle_group: muscleGroup } = req.body;
  exerciseModel.createExercise(name, muscleGroup, (err, exerciseId) => {
    if (err) return next(err);

    return exerciseModel.getExerciseById(exerciseId, (findErr, exercise) => {
      if (findErr) return next(findErr);
      return res.status(201).json({ message: 'Exercise created successfully.', data: exercise });
    });
  });
};

const getExercises = (req, res, next) => {
  exerciseModel.getAllExercises((err, exercises) => {
    if (err) return next(err);
    return res.status(200).json({ message: 'Exercises fetched successfully.', data: exercises });
  });
};

const getExerciseById = (req, res, next) => {
  const id = Number(req.params.id);
  exerciseModel.getExerciseById(id, (err, exercise) => {
    if (err) return next(err);
    if (!exercise) return res.status(404).json({ message: 'Exercise not found.' });
    return res.status(200).json({ message: 'Exercise fetched successfully.', data: exercise });
  });
};

const updateExercisePut = (req, res, next) => {
  const id = Number(req.params.id);
  const { name, muscle_group: muscleGroup } = req.body;

  exerciseModel.updateExercisePut(id, name, muscleGroup, (err, changes) => {
    if (err) return next(err);
    if (!changes) return res.status(404).json({ message: 'Exercise not found.' });

    return exerciseModel.getExerciseById(id, (findErr, exercise) => {
      if (findErr) return next(findErr);
      return res.status(200).json({ message: 'Exercise updated successfully.', data: exercise });
    });
  });
};

const updateExercisePatch = (req, res, next) => {
  const id = Number(req.params.id);

  exerciseModel.updateExercisePatch(id, req.body, (err, changes) => {
    if (err && err.message === 'No valid fields to update') {
      return res.status(400).json({ message: err.message });
    }
    if (err) return next(err);
    if (!changes) return res.status(404).json({ message: 'Exercise not found.' });

    return exerciseModel.getExerciseById(id, (findErr, exercise) => {
      if (findErr) return next(findErr);
      return res.status(200).json({ message: 'Exercise patched successfully.', data: exercise });
    });
  });
};

const deleteExercise = (req, res, next) => {
  const id = Number(req.params.id);

  exerciseModel.deleteExercise(id, (err, changes) => {
    if (err) return next(err);
    if (!changes) return res.status(404).json({ message: 'Exercise not found.' });
    return res.status(200).json({ message: 'Exercise deleted successfully.' });
  });
};

module.exports = {
  createExercise,
  getExercises,
  getExerciseById,
  updateExercisePut,
  updateExercisePatch,
  deleteExercise,
};
