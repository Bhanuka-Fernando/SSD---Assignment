// server.js
const app = require("./app");

const port = process.env.PORT || 8070;

// Only start the server if it's not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Hospital app listening on port ${port}!`);
  });
}

module.exports = app;  // Export the app for testing
