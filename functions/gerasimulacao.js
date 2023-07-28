const Tipo = require("../models/Tipo");
const Servico = require("../models/Servico");
const bodyParser = require("body-parser");
const { price, monetario } = require("./price");
const Simulacao = require("../models/Simulacao");
const Cliente = require("../models/Clientes");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function gerasimulacao(idInformado) {
    const id = idInformado;
    const dados = await Simulacao.findOne({ raw: true, where: { id: id } });
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
    return parcelas;
  }
  module.exports = gerasimulacao;