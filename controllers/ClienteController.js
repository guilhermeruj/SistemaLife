const Tipo = require("../models/Tipo");
const Servico = require("../models/Servico");
const User = require("../models/Users");
const bodyParser = require("body-parser");
const Simulacao = require("../models/Simulacao");
const Cliente = require("../models/Clientes");
const { where } = require("sequelize");
const moment = require("moment");

module.exports = class ClienteController {
  static async perfilcliente(req, res) {
    const id = req.params.id;
    const dados = await Cliente.findOne({ raw: true, where: { id: id } });
    const simulacao = await Simulacao.findAll({
      raw: true,
      where: { ClienteId: id },
    });
    const aniv = moment(dados.dataNascimento);
    const anivFormt = aniv.format("DD/MM/YYYY");

    const userNivel = req.session.usernivel;
    res.render("silife/perfilcliente", {
      username: req.session.username,
      userNivel,
      dados,
      anivFormt,
      simulacao,
    });
  }
  static async deletecliente(req, res) {
    const id = req.params.id;
    await Cliente.destroy({ where: { id: id } });
    await Simulacao.destroy({ where: { ClienteId: id } });
    res.redirect("/clientes");
  }
  static async editcliente(req, res) {
    const id = req.params.id;
    const dados = await Cliente.findOne({ raw: true, where: { id: id } });
    res.render("silife/editcliente", {
      dados,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }
  static async indicar(req, res) {
    const id = req.session.userid;
    const clientes = await Cliente.findAll({
      raw: true,
      where: { UserId: id },
    });
    res.render("silife/indicar", {
      clientes,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }
  static async indicarPost(req, res) {
    const id = req.params.id;
    const indicado = "indicado";

    try {
      await Cliente.update(
        { indicar: indicado }, // Novo valor do campo 'indicar'
        { where: { id: id } } // Condição para a atualização (nesse caso, pelo ID)
      );

      res.redirect("/indicar");
    } catch (error) {
      console.log(error);
      res.redirect("/indicar");
    }
  }

  static async aprovarCliente(req, res){
    const id = req.params.id
    const aprovar = "Aprovado"
    await Servico.update({ analize: aprovar }, { where: { id: id }});
    res.redirect("/perfilcliente/" + id);
  }
  static async reprovarCliente(req, res){
    const id = req.params.id
    const reprovado = "Reprovado"
    await Servico.update({ analize: reprovado }, { where: { id: id }});
    res.redirect("/perfilcliente/" + id);
  }
};
