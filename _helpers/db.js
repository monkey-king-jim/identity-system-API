require("dotenv").config("../.env");
const Sequelize = require("sequelize");
const { DataTypes } = require("Sequelize");
const user = require("../users/user.model");
const refreshToken = require("../users/refresh-token.model");

module.exports = db = {};

initiate_db();

async function initiate_db() {
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
  db.RefreshToken = refreshToken(sequelize);

  // relationships
  db.User.hasMany(db.RefreshToken, {
    foreignKey: {
      // name: 'userId'
      type: DataTypes.UUID,
    },
    onDelete: "CASCADE",
  }); // delete child rows when deleting corresponding parent record
  db.RefreshToken.belongsTo(db.User);

  // sync models with database
  await sequelize.sync();
}
