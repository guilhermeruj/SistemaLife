const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // CPF deve ser único para cada usuário
  },
  rg: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // RG deve ser único para cada usuário
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Email deve ser único para cada usuário
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nivel: {
    type: DataTypes.ENUM('adm', 'user'), // Pode ser apenas admin ou user
    allowNull: false,
    defaultValue: 'user' // Nível padrão é 'user'
  }
});

module.exports = User;