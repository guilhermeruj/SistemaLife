const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const User = require("./Users");

const Cliente = db.define("Cliente", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataNascimento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  rg: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  indicar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasMany(Cliente);
Cliente.belongsTo(User);

module.exports = Cliente;
