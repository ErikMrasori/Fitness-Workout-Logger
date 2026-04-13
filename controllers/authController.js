const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    if (role && !['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or user.' });
    }

    const normalizedRole = role === 'admin' ? 'admin' : 'user';

    userModel.findByUsername(username, async (findErr, existingUser) => {
      if (findErr) {
        return next(findErr);
      }

      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      userModel.createUser(username, hashedPassword, normalizedRole, (createErr, userId) => {
        if (createErr) {
          return next(createErr);
        }

        return res.status(201).json({
          message: 'User registered successfully.',
          data: {
            id: userId,
            username,
            role: normalizedRole,
          },
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  const { username, password } = req.body;

  userModel.findByUsername(username, async (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  });
};

module.exports = {
  register,
  login,
};
