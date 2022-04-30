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
    firstName: { type: Sequelize.DataTypes.STRING, allowNull: false },
    lastName: { type: Sequelize.DataTypes.STRING, allowNull: false },
    role: { type: Sequelize.DataTypes.STRING, allowNull: false },
    verificationToken: { type: Sequelize.DataTypes.STRING },
    verified: { type: Sequelize.DataTypes.DATE },
    resetToken: { type: Sequelize.DataTypes.STRING },
    resetTokenExpires: { type: Sequelize.DataTypes.DATE },
    isVerified: {
      type: DataTypes.VIRTUAL,
      get() {
        return !!this.verified;
      },
    },
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
