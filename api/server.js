// server.js
const app = require("./app");

const port = process.env.PORT || 8070;

app.listen(port, () => {
  console.log(`Hospital app listening on port ${port}!`);
});
