const sequelize = require("../lib/db");
const Sequelize = require("sequelize");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: { type: Sequelize.DataTypes.STRING, allowNull: false },
  email: { type: Sequelize.DataTypes.STRING, allowNull: false },
  password: { type: Sequelize.DataTypes.STRING, allowNull: false },
});

module.exports = User;
