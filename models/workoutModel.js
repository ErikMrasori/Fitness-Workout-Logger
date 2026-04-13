const db = require('../config/db');

const hasField = (fields, key) => Object.prototype.hasOwnProperty.call(fields, key);

const createWorkout = (userId, name, date, callback) => {
  db.run(
    'INSERT INTO workouts (user_id, name, date) VALUES (?, ?, ?)',
    [userId, name, date],
    function insertWorkout(err) {
      callback(err, this?.lastID);
    }
  );
};

const getAllWorkouts = (callback) => {
  db.all('SELECT * FROM workouts ORDER BY date DESC, id DESC', [], callback);
};

const getWorkoutsByUser = (userId, callback) => {
  db.all('SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC, id DESC', [userId], callback);
};

const getWorkoutById = (id, callback) => {
  db.get('SELECT * FROM workouts WHERE id = ?', [id], callback);
};

const updateWorkoutPut = (id, name, date, callback) => {
  db.run(
    'UPDATE workouts SET name = ?, date = ? WHERE id = ?',
    [name, date, id],
    function updateWorkout(err) {
      callback(err, this?.changes);
    }
  );
};

const updateWorkoutPatch = (id, fields, callback) => {
  const updates = [];
  const values = [];

  if (hasField(fields, 'name')) {
    updates.push('name = ?');
    values.push(fields.name);
  }

  if (hasField(fields, 'date')) {
    updates.push('date = ?');
    values.push(fields.date);
  }

  if (updates.length === 0) {
    callback(new Error('No valid fields to update'));
    return;
  }

  values.push(id);
  const sql = `UPDATE workouts SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, values, function patchWorkout(err) {
    callback(err, this?.changes);
  });
};

const deleteWorkout = (id, callback) => {
  db.run('DELETE FROM workouts WHERE id = ?', [id], function removeWorkout(err) {
    callback(err, this?.changes);
  });
};

module.exports = {
  createWorkout,
  getAllWorkouts,
  getWorkoutsByUser,
  getWorkoutById,
  updateWorkoutPut,
  updateWorkoutPatch,
  deleteWorkout,
};
