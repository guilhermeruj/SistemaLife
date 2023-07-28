const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const Cliente = require("./Clientes.js");

const Simulacao = db.define("Simulacao", {
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  servico: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parcela: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vlrmx: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vlrp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  taxa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipodataxa: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  situacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  analize: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Cliente.hasMany(Simulacao);
Simulacao.belongsTo(Cliente);

module.exports = Simulacao;
