// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("sislife", "guilhermerosa", "Uu232336364", {
//   host: "localhost",
//   dialect: "mysql",
// });

// try {
//   sequelize.authenticate();
//   console.log("Conectou com sucesso com o Sequelize");
// } catch (err) {
//   console.log("Não foi possivel conectar:", error);
// }

// module.exports = sequelize;

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("sislife", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectou com sucesso com o Sequelize");
} catch (err) {
  console.log("Não foi possivel conectar:", error);
}

module.exports = sequelize;
