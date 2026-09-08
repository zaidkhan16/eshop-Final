const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../backend/config/.env"),
});
const app = require("../backend/app");

module.exports = app;

