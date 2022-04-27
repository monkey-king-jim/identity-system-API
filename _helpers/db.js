require("dotenv").config("../.env");
const Sequelize = require("sequelize");
const user = require("../users/user.model");

module.exports = db;

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;

// connect to db
const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  dialect: "mysql",
  host: DB_HOST,
});

// initiate model(s) and attach them to db object
// add models here
db.User = user(sequelize);

// sync models with database
await sequelize.sync();
