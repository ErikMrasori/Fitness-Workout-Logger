const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logDir, 'requests.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const requestLogger = (req, res, next) => {
  const line = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;

  fs.appendFile(logFile, line, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to write request log:', err.message);
    }
  });

  next();
};

module.exports = requestLogger;
