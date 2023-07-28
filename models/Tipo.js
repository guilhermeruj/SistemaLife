const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const tipo = db.define('tipo', {
  tipo: {
    type: DataTypes.STRING,
    allowNull: null
  }
})
module.exports = tipo;