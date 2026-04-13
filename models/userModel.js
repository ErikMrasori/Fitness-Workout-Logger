const db = require('../config/db');

const createUser = (username, password, role, callback) => {
  const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  db.run(sql, [username, password, role], function insertUser(err) {
    callback(err, this?.lastID);
  });
};

const findByUsername = (username, callback) => {
  db.get('SELECT * FROM users WHERE username = ?', [username], callback);
};

const findById = (id, callback) => {
  db.get('SELECT id, username, role FROM users WHERE id = ?', [id], callback);
};

const listUsers = (callback) => {
  db.all('SELECT id, username, role FROM users ORDER BY id ASC', [], callback);
};

const updateUserPut = (id, username, role, callback) => {
  const sql = 'UPDATE users SET username = ?, role = ? WHERE id = ?';
  db.run(sql, [username, role, id], function updateUser(err) {
    callback(err, this?.changes);
  });
};

const updateUserPatch = (id, fields, callback) => {
  const allowed = [];
  const values = [];

  if (fields.username) {
    allowed.push('username = ?');
    values.push(fields.username);
  }

  if (fields.role) {
    allowed.push('role = ?');
    values.push(fields.role);
  }

  if (allowed.length === 0) {
    callback(new Error('No valid fields to update'));
    return;
  }

  values.push(id);
  const sql = `UPDATE users SET ${allowed.join(', ')} WHERE id = ?`;

  db.run(sql, values, function patchUser(err) {
    callback(err, this?.changes);
  });
};

const deleteUser = (id, callback) => {
  db.run('DELETE FROM users WHERE id = ?', [id], function removeUser(err) {
    callback(err, this?.changes);
  });
};

module.exports = {
  createUser,
  findByUsername,
  findById,
  listUsers,
  updateUserPut,
  updateUserPatch,
  deleteUser,
};
