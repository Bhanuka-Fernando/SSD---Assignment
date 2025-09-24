// server.js
require('dotenv').config();            // load .env early

const app = require('./app');

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) return val;  // named pipe
  if (port >= 0) return port;          // port number
  return false;
}

const port = normalizePort(process.env.PORT || 8070);
app.set('port', port);

const server = app.listen(port, () => {
  console.log(`Hospital app listening on port ${port}!`);
});

// Graceful shutdown (nice to have)
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing HTTP server');
  server.close(() => console.log('HTTP server closed'));
});
process.on('SIGINT', () => {
  console.log('SIGINT received: closing HTTP server');
  server.close(() => console.log('HTTP server closed'));
});

// Catch unhandled promise rejections (so the process doesn’t just disappear)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
