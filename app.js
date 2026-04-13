const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const logRoutes = require('./routes/logRoutes');

require('./config/db');

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Fitness Workout Logger API is running.' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);
app.use('/exercises', exerciseRoutes);
app.use('/logs', logRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use(errorHandler);

module.exports = app;
