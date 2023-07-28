const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const Tipo = require("./Tipo");

const Servico = db.define("servico", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  taxa: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tipodataxa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prazo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idademax: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idademxreducao: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ltv: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  vmin: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  vmax: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});
Tipo.hasMany(Servico);
Servico.belongsTo(Tipo);

module.exports = Servico;
