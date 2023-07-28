const Tipo = require("../models/Tipo");
const Servico = require("../models/Servico");
const User = require("../models/Users");
const bodyParser = require("body-parser");
const { price, monetario } = require("../functions/price");
const Simulacao = require("../models/Simulacao");
const Cliente = require("../models/Clientes");
const cadSimula = require("../functions/cadSimula");
const PDFDocument = require("pdfkit");

module.exports = class siteController {
  static async geraOperacao(req, res) {
    try {
      const tipo = await Tipo.findAll({ raw: true });

      if (tipo.length === 0) {
        // Se não houver informações encontradas, retorne status 404 com uma mensagem
        return res
          .status(404)
          .json({ message: "Nenhuma informação encontrada." });
      }

      // Se as informações forem encontradas, retorne status 200 com os dados
      return res.status(200).json(tipo);
    } catch (error) {
      console.error(error);
      // Em caso de erro, retorne status 500 com uma mensagem de erro
      return res
        .status(500)
        .json({ message: "Erro ao buscar as informações." });
    }
  }
  static async geraServico(req, res) {
    const id = req.params.id;
    try {
      const servico = await Servico.findAll({
        raw: true,
        where: { tipoId: id },
      });

      if (servico.length === 0) {
        // Se não houver informações encontradas, retorne status 404 com uma mensagem
        return res
          .status(404)
          .json({ message: "Nenhuma informação encontrada." });
      }
      return res.status(200).json(servico);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao buscar as informações" });
    }
  }
  static async geraServicosOne(req, res) {
    const id = req.params.id;
    try {
      const servicoOne = await Servico.findOne({
        raw: true,
        where: { id: id },
      });
      if (servicoOne.length === 0) {
        return res
          .status(404)
          .json({ message: "Nenhuma informação encontrada" });
      }
      return res.status(200).json(servicoOne);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao buscar as informações" });
    }
  }
  static async simularApi(req, res) {
    const {
      name,
      dataNascimento,
      tel,
      email,
      tipo,
      servico,
      parcela,
      ltv,
      vlrmx,
      vlrp,
      taxa,
    } = req.body;

    const dados = {
      id: 3,
      name,
      dataNascimento,
      tel,
      email,
      tipo,
      servico,
      parcela,
      ltv,
      vlrmx,
      vlrp,
      taxa,
    };
    try {
      const simulacaoId = await cadSimula(dados);
      if (simulacaoId.length === 0) {
        // Se não houver informações encontradas, retorne status 404 com uma mensagem
        return res
          .status(404)
          .json({ message: "Nenhuma informação encontrada." });
      }
      return res.status(200).json(simulacaoId);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao buscar as informações" });
    }
  }

  //Gera a simulação e envia ao Front
  static async simulaTable(req, res){
    const id = req.params.id;
    const dados = await Simulacao.findOne({ raw: true, where: { id: id } });
    const clienteId = dados.ClienteId;
    const cliente = await Cliente.findOne({
      raw: true,
      where: { id: clienteId },
    });
    const vlrp = dados.vlrp;
    const parcela = dados.parcela;
    const taxa = dados.taxa;

    const valorEmp = parseFloat(vlrp.replace(/[^\d,-]/g, "").replace(",", ".")); // Converte o valor do empréstimo para um número
    const numParcela = parseInt(parcela); // Converte a taxa de juros para um número
    const juros = parseFloat(taxa); // Converte o número de parcelas para um número
    const seguroMip1 = 0.021135 / 100 + 1;

    const data = {
      parcela: numParcela,
      valorEmp: valorEmp,
      juros: juros,
      seguroMip: seguroMip1,
      vlrDFI: 0.0037 / 100 + 1,
      taxaADM: 25,
      contar: 1,
      vlrParcelafixa: price(valorEmp, juros, numParcela), // Calcula o valor fixo da parcela com base nos parâmetros
    };

    // Seguros
    data.taxaDIF = data.valorEmp * data.vlrDFI - data.valorEmp; // Calcula a taxa DIF
    const parcelas = [];
    let valorParcelaCorrente = data.valorEmp;

    while (data.contar <= data.parcela) {
      // Seguros
      data.taxaSeguroMIP =
        valorParcelaCorrente * data.seguroMip - valorParcelaCorrente; // Calcula a taxa do seguro MIP
      data.parcelaFinal =
        data.vlrParcelafixa + data.taxaDIF + data.taxaADM + data.taxaSeguroMIP; // Calcula o valor final da parcela

      const taxa = data.juros / 100 + 1;
      const descJuros = valorParcelaCorrente * taxa - valorParcelaCorrente; // Calcula o valor dos juros descontados
      const armotizar = data.vlrParcelafixa - descJuros; // Calcula o valor a ser amortizado do empréstimo

      valorParcelaCorrente -= armotizar; // Atualiza o valor da parcela corrente subtraindo o valor amortizado

      parcelas.push({
        contar: data.contar,
        valorEmp: monetario(valorParcelaCorrente), // Valor da parcela corrigido aqui
        armotizar: monetario(armotizar),
        descJuros: monetario(descJuros),
        taxaSeguroMIP: monetario(data.taxaSeguroMIP),
        taxaDIF: monetario(data.taxaDIF),
        taxaADM: monetario(data.taxaADM),
        parcelaFinal: monetario(data.parcelaFinal),
      });

      data.contar++;
    }
    try {
      if (parcelas.length === 0) {
        // Se não houver informações encontradas, retorne status 404 com uma mensagem
        return res
          .status(404)
          .json({ message: "Nenhuma informação encontrada." });
      }
      return res.status(200).json(parcelas);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao buscar as informações" });
    }

  }
  static async simulaCliente(req, res){
    const id = req.params.id;
    const simulacao = await Simulacao.findOne({raw: true, where: {id: id}})
    const idCliente = simulacao.ClienteId
    const cliente = await Cliente.findOne({raw: true, where: {id: idCliente}})
    const dados = {
      ...simulacao,
      cliente
    }
    try{

      if(cliente.length === 0 ){
        return res
        .status(400)
        .json({message: "Nenhum cliente encontrado"})
      }
      return res.status(200).json(dados)
    }catch (error){
      console.log(error)
      return res.status(500).json({message: "Erro ao buscar o Cliente"})
    }
  }
};
