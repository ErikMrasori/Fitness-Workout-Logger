const userModel = require('../models/userModel');

const getUsers = (req, res, next) => {
  userModel.listUsers((err, users) => {
    if (err) return next(err);
    return res.status(200).json({ message: 'Users fetched successfully.', data: users });
  });
};

const getUserById = (req, res, next) => {
  const id = Number(req.params.id);
  userModel.findById(id, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json({ message: 'User fetched successfully.', data: user });
  });
};

const updateUserPut = (req, res, next) => {
  const id = Number(req.params.id);
  const { username, role } = req.body;
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Role must be admin or user.' });
  }

  userModel.updateUserPut(id, username, role, (err, changes) => {
    if (err) return next(err);
    if (!changes) return res.status(404).json({ message: 'User not found.' });

    return userModel.findById(id, (findErr, user) => {
      if (findErr) return next(findErr);
      return res.status(200).json({ message: 'User updated successfully.', data: user });
    });
  });
};

const updateUserPatch = (req, res, next) => {
  const id = Number(req.params.id);

  if (req.body.role && !['admin', 'user'].includes(req.body.role)) {
    return res.status(400).json({ message: 'Role must be admin or user.' });
  }

  userModel.updateUserPatch(id, req.body, (err, changes) => {
    if (err && err.message === 'No valid fields to update') {
      return res.status(400).json({ message: err.message });
    }
    if (err) return next(err);
    if (!changes) return res.status(404).json({ message: 'User not found.' });

    return userModel.findById(id, (findErr, user) => {
      if (findErr) return next(findErr);
      return res.status(200).json({ message: 'User patched successfully.', data: user });
    });
  });
};

const deleteUser = (req, res, next) => {
  const id = Number(req.params.id);
  userModel.deleteUser(id, (err, changes) => {
    if (err) return next(err);
    if (!changes) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json({ message: 'User deleted successfully.' });
  });
};

module.exports = {
  getUsers,
  getUserById,
  updateUserPut,
  updateUserPatch,
  deleteUser,
};
