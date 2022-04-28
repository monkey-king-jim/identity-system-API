const Sequelize = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: { type: Sequelize.DataTypes.STRING, allowNull: false },
    email: { type: Sequelize.DataTypes.STRING, allowNull: false },
    password: { type: Sequelize.DataTypes.STRING, allowNull: false },
  };

  const options = {
    defaultScope: {
      // not include hashed password
      attributes: { exclude: ["password"] },
    },
    // other scope(s)
    scopes: {
      // include password
      withPassword: { attributes: {} },
    },
  };
  return sequelize.define("User", attributes, options);
}
