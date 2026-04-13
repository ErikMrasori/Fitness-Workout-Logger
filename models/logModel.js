const db = require('../config/db');

const createLog = (workoutId, exerciseId, reps, sets, callback) => {
  db.run(
    'INSERT INTO logs (workout_id, exercise_id, reps, sets) VALUES (?, ?, ?, ?)',
    [workoutId, exerciseId, reps, sets],
    function insertLog(err) {
      callback(err, this?.lastID);
    }
  );
};

const getAllLogs = (callback) => {
  const sql = `
    SELECT logs.*, workouts.user_id
    FROM logs
    JOIN workouts ON workouts.id = logs.workout_id
    ORDER BY logs.id DESC
  `;
  db.all(sql, [], callback);
};

const getLogsByUser = (userId, callback) => {
  const sql = `
    SELECT logs.*, workouts.user_id
    FROM logs
    JOIN workouts ON workouts.id = logs.workout_id
    WHERE workouts.user_id = ?
    ORDER BY logs.id DESC
  `;
  db.all(sql, [userId], callback);
};

const getLogById = (id, callback) => {
  const sql = `
    SELECT logs.*, workouts.user_id
    FROM logs
    JOIN workouts ON workouts.id = logs.workout_id
    WHERE logs.id = ?
  `;
  db.get(sql, [id], callback);
};

const updateLogPut = (id, workoutId, exerciseId, reps, sets, callback) => {
  db.run(
    'UPDATE logs SET workout_id = ?, exercise_id = ?, reps = ?, sets = ? WHERE id = ?',
    [workoutId, exerciseId, reps, sets, id],
    function updateLog(err) {
      callback(err, this?.changes);
    }
  );
};

const updateLogPatch = (id, fields, callback) => {
  const updates = [];
  const values = [];

  if (fields.workout_id) {
    updates.push('workout_id = ?');
    values.push(fields.workout_id);
  }
  if (fields.exercise_id) {
    updates.push('exercise_id = ?');
    values.push(fields.exercise_id);
  }
  if (fields.reps) {
    updates.push('reps = ?');
    values.push(fields.reps);
  }
  if (fields.sets) {
    updates.push('sets = ?');
    values.push(fields.sets);
  }

  if (updates.length === 0) {
    callback(new Error('No valid fields to update'));
    return;
  }

  values.push(id);
  const sql = `UPDATE logs SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, values, function patchLog(err) {
    callback(err, this?.changes);
  });
};

const deleteLog = (id, callback) => {
  db.run('DELETE FROM logs WHERE id = ?', [id], function removeLog(err) {
    callback(err, this?.changes);
  });
};

module.exports = {
  createLog,
  getAllLogs,
  getLogsByUser,
  getLogById,
  updateLogPut,
  updateLogPatch,
  deleteLog,
};
