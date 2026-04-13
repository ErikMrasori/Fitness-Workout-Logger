const db = require('../config/db');

const createExercise = (name, muscleGroup, callback) => {
  db.run(
    'INSERT INTO exercises (name, muscle_group) VALUES (?, ?)',
    [name, muscleGroup],
    function insertExercise(err) {
      callback(err, this?.lastID);
    }
  );
};

const getAllExercises = (callback) => {
  db.all('SELECT * FROM exercises ORDER BY id ASC', [], callback);
};

const getExerciseById = (id, callback) => {
  db.get('SELECT * FROM exercises WHERE id = ?', [id], callback);
};

const updateExercisePut = (id, name, muscleGroup, callback) => {
  db.run(
    'UPDATE exercises SET name = ?, muscle_group = ? WHERE id = ?',
    [name, muscleGroup, id],
    function updateExercise(err) {
      callback(err, this?.changes);
    }
  );
};

const updateExercisePatch = (id, fields, callback) => {
  const updates = [];
  const values = [];

  if (fields.name) {
    updates.push('name = ?');
    values.push(fields.name);
  }

  if (fields.muscle_group) {
    updates.push('muscle_group = ?');
    values.push(fields.muscle_group);
  }

  if (updates.length === 0) {
    callback(new Error('No valid fields to update'));
    return;
  }

  values.push(id);
  const sql = `UPDATE exercises SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, values, function patchExercise(err) {
    callback(err, this?.changes);
  });
};

const deleteExercise = (id, callback) => {
  db.run('DELETE FROM exercises WHERE id = ?', [id], function removeExercise(err) {
    callback(err, this?.changes);
  });
};

module.exports = {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercisePut,
  updateExercisePatch,
  deleteExercise,
};
