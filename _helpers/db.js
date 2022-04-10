require("dotenv").config("../.env");
const mysql = require("mysql");
const Sequelize = require("sequelize");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
// const DB_PORT = process.env.DB_PORT;

// // const port = process.env.PORT;

// const db = mysql.createPool({
//   connectionLimit: 100,
//   host: DB_HOST,
//   user: DB_USER,
//   password: DB_PASSWORD,
//   database: DB_DATABASE,
//   port: DB_PORT,
// });

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  dialect: "mysql",
  host: DB_HOST,
});

// try {
//   await sequelize.authenticate();
//   console.log("Connection has been established successfully.");
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }

// db.getConnection((err, connection) => {
//   if (err) throw err;
//   console.log("DB connected successful: " + connection.threadId);
// });

// app.listen(port, () => console.log(`Server running on port ${port}...`));

// exports.db = db;
module.exports = sequelize;
