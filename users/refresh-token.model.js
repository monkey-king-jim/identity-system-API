const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    token: { type: DataTypes.STRING },
    expires: { type: DataTypes.DATE },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    revoked: { type: DataTypes.DATE },
    replacedByToken: { type: DataTypes.STRING },
    isExpired: {
      type: DataTypes.VIRTUAL, // VIRTUAL properties are available on the sequalzie model but will not persist to database
      get() {
        return Date.now() >= this.expires;
      },
    },
    isActive: {
      type: DataTypes.VIRTUAL,
      get() {
        return !this.revoked && !this.isExpired;
      },
    },
  };

  const options = {};

  return sequelize.define("refreshToken", attributes, options);
}
