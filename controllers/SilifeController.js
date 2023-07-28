const Tipo = require("../models/Tipo");
const Servico = require("../models/Servico");
const User = require("../models/Users");
const bodyParser = require("body-parser");
const { price, monetario } = require("../functions/price");
const Simulacao = require("../models/Simulacao");
const Cliente = require("../models/Clientes");
const cadSimula = require("../functions/cadSimula");
const PDFDocument = require("pdfkit");
const moment = require("moment");
const gerasimulacao = require("../functions/gerasimulacao");

module.exports = class silifeController {
  static async clientes(req, res) {
    const clientes = await Cliente.findAll({ raw: true });
    res.render("silife/clientes", {
      clientes,
      userNivel: req.session.usernivel,
    });
  }

  static async showSilife(req, res) {
    const userNivel = req.session.usernivel
    if (userNivel === "adm") {
      // Pesquisa parceiros
      const pesqParceiros = await User.findAll({
        raw: true,
        where: { nivel: "user" },
      });
      const parceiros = pesqParceiros.length;

      const pesqClientes = await Cliente.findAll({
        raw: true,
        where: { indicar: "indicado" },
      });
      const clientes = pesqClientes.length;

      const pesqSimulacao = await Simulacao.findAll({ raw: true });
      const simulacao = pesqSimulacao.length;

      res.render("silife/home", {
        username: req.session.username,
        userNivel,
        parceiros,
        clientes,
        simulacao,
        pesqSimulacao,
        pesqClientes,
      });
    } else {
      if (id) {
        // Consulta os clientes do usuário atual
        const clientes = await Cliente.findAll({
          raw: true,
          where: { UserId: id },
        });

        // Obtém os IDs dos clientes
        const idClientes = clientes.map((cliente) => cliente.id);

        // Consulta as simulações dos clientes
        const simulacoes = await Simulacao.findAll({
          raw: true,
          where: { ClienteId: idClientes },
        });

        // Contagem das simulações com a coluna "situacao" igual a "Não indicado"
        const countNaoIndicado = await Simulacao.count({
          where: { ClienteId: idClientes, situacao: "Não indicado" },
        });

        // Contagem das simulações com a coluna "situacao" igual a "Indicado"
        const countIndicado = await Simulacao.count({
          where: { ClienteId: idClientes, situacao: "indicado" },
        });

        // Cria um objeto para armazenar a quantidade de simulações por cliente
        const quantidadeSimulacoes = {};

        // Calcula a quantidade de simulações para cada cliente
        idClientes.forEach((idCliente) => {
          const count = simulacoes.filter(
            (simulacao) => simulacao.ClienteId === idCliente
          ).length;
          quantidadeSimulacoes[idCliente] = count;
        });

        // Obtém o número total de simulações
        const totalSimulacoes = Object.values(quantidadeSimulacoes).reduce(
          (total, count) => total + count,
          0
        );

        // Mapeando o tipoId para o name do tipo
        const clientesMapeados = simulacoes.map((simulacoes) => {
          const clienteEncontrado = clientes.find(
            (t) => t.id === simulacoes.ClienteId
          );
          return {
            ...simulacoes,
            cliente: clienteEncontrado
              ? clienteEncontrado.name
              : "Cliente não encontrado",
          };
        });

        res.render("silife/home", {
          username: req.session.username,
          userNivel: req.session.usernivel,
          simulacoes,
          clientes,
          clientesMapeados,
          quantidadeSimulacoes,
          totalSimulacoes,
          countNaoIndicado,
          countIndicado,
        });
      } else {
        res.render("silife/home", {
          username: req.session.username,
          userNivel: req.session.usernivel,
        });
      }
    }
  }

  // Carrega a pagina de cadastro de tipo
  static cadTipo(req, res) {
    res.render("silife/cadTipo", {
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }

  // Cadastra o tipo no banco
  static async cadTipoPost(req, res) {
    const { tipo } = req.body;
    await Tipo.create({ tipo });
    const ok = "Cadastrado";
    res.render("silife/cadTipo", {
      ok,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }
  // Lista tipos
  static async listatipo(req, res) {
    const tipos = await Tipo.findAll({ raw: true });
    res.render("silife/listatipo", {
      tipos,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }

  static async editatipo(req, res) {
    const id = req.params.id;
    const tipos = await Tipo.findOne({ raw: true, where: { id: id } });

    res.render("silife/edittipo", {
      tipos,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }

  static async editatipoPost(req, res) {
    const { id, tipo } = req.body;
    await Tipo.update({ tipo: tipo }, { where: { id: id } });
    res.redirect("/listatipo");
  }

  static async deletatipo(req, res) {
    const id = req.params.id;
    await Tipo.destroy({ where: { id: id } });
    res.redirect("/listatipo");
  }

  // Carrega a pagina que lista os serviços já cadastrados
  static async listaservicos(req, res) {
    const servicos = await Servico.findAll({ raw: true });
    const tipo = await Tipo.findAll({ raw: true });
    console.dir(servicos);

    // servicos.forEach((servico) => {
    //   if (servico.tipodataxa === "anual") {
    //     const taxaMensal = servico.taxa; // Taxa de juros mensal em porcentagem
    //     const taxaAnual = (Math.pow(1 + taxaMensal / 100, 12) - 1) * 100; // Taxa de juros anual
    //     const taxaAnualFinal = (taxaAnual + 0.01).toFixed(0); // Adicionando 0.01 para arredondar para 9
    //     servico.taxa = taxaAnualFinal;
    //     console.log(servico.taxa);
    //   }
    // });

    console.dir(servicos);
    // Mapeando o tipoId para o name do tipo
    const servicosMapeados = servicos.map((servico) => {
      const tipoEncontrado = tipo.find((t) => t.id === servico.tipoId);
      return {
        ...servico,
        tipo: tipoEncontrado ? tipoEncontrado.tipo : "Tipo não encontrado",
      };
    });

    res.render("silife/listservicos", {
      servicos: servicosMapeados,
      username: req.session.username,
      userNivel: req.session.usernivel,
      tipo,
    });
  }

  static async listarServicoId(req, res) {
    try {
      const servicoId = req.query.id;
      console.log(servicoId);
      if (servicoId === "0") {
        // Trate qualquer outro erro que possa ocorrer durante a execução da função.
        const servicos = await Servico.findAll({ raw: true });
        const tipo = await Tipo.findAll({ raw: true });

        // Mapeando o tipoId para o name do tipo
        const servicosMapeados = servicos.map((servico) => {
          const tipoEncontrado = tipo.find((t) => t.id === servico.tipoId);
          return {
            ...servico,
            tipo: tipoEncontrado ? tipoEncontrado.tipo : "Tipo não encontrado",
          };
        });

        res.render("silife/listservicos", {
          servicos: servicosMapeados,
          username: req.session.username,
          userNivel: req.session.usernivel,
          tipo,
        });
      } else {
        const servicos = await Servico.findAll({
          raw: true,
          where: { tipoId: servicoId },
        });
        const tipo = await Tipo.findAll({ raw: true });

        //Mapeando os Serviços
        const servicosMapeados = servicos.map((servico) => {
          const tipoEncontrado = tipo.find((t) => t.id === servico.tipoId);
          return {
            ...servico,
            tipo: tipoEncontrado ? tipoEncontrado.tipo : "Tipo não encontrado",
          };
        });
        res.render("silife/listservicos", {
          servicos: servicosMapeados,
          username: req.session.username,
          userNivel: req.session.usernivel,
          tipo,
        });
      }
    } catch (error) {
      // Trate qualquer outro erro que possa ocorrer durante a execução da função.
      console.error(error);
      const servicos = await Servico.findAll({ raw: true });
      const tipo = await Tipo.findAll({ raw: true });

      // Mapeando o tipoId para o name do tipo
      const servicosMapeados = servicos.map((servico) => {
        const tipoEncontrado = tipo.find((t) => t.id === servico.tipoId);
        return {
          ...servico,
          tipo: tipoEncontrado ? tipoEncontrado.tipo : "Tipo não encontrado",
        };
      });

      res.render("silife/listservicos", {
        servicos: servicosMapeados,
        username: req.session.username,
        userNivel: req.session.usernivel,
        tipo,
      });
    }
  }

  static async editservico(req, res) {
    const id = req.params.id;
    const servicos = await Servico.findOne({ raw: true, where: { id: id } });
    const tipo = await Tipo.findAll({ raw: true });

    // if (servicos.tipodataxa === "anual") {
    //   const taxaMensal = servicos.taxa; // Taxa de juros mensal em porcentagem
    //   const taxaAnual = (Math.pow(1 + taxaMensal / 100, 12) - 1) * 100; // Taxa de juros anual
    //   const taxaAnualFinal = (taxaAnual + 0.01).toFixed(0); // Adicionando 0.01 para arredondar para 9
    //   servicos.taxa = taxaAnualFinal;
    //   console.log(servicos.taxa);
    // }

    res.render("silife/editservico", {
      servicos,
      tipo,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }

  static async editservicPost(req, res) {
    try {
      const {
        idEdit,
        tipoId,
        name,
        taxa,
        tipodataxa,
        prazo,
        idademax,
        idademxreducao,
        ltv,
        vmin,
      } = req.body;
      console.log(`O id passado é ${idEdit}`)
      const valorMin = parseFloat(
        vmin.replace(/[^\d,-]/g, "").replace(",", ".")
      );

       const cad = {
        tipoId,
        name,
        taxa,
        tipodataxa,
        prazo,
        idademax: parseInt(idademax),
        idademxreducao,
        ltv,
        vmin: valorMin,
        vmax: 3000000,
      };

      console.dir(cad);

      // if (tipodataxa === "anual") {
      //   const taxaAnual = parseFloat(taxa) / 100; // Conversão para decimal
      //   const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1; // Taxa de juros mensal
      //   const taxaMensalFinal = (taxaMensal * 100).toFixed(2);
      //   cad.taxa = taxaMensalFinal;
      // }
      console.dir(cad);

      await Servico.update(cad, { where: { id: idEdit } });
      req.flash("success", "Serviço alterado com sucesso");

      res.redirect("/editservico/" + idEdit);
    } catch (error) {
      console.error(error);
      // Envie a resposta com a flag de erro como JSON, se aplicável
      req.flash("message", "Usuário não encontrado!");
      res.render(`silife/editservico/${idEdit}`, {
        username: req.session.username,
        userNivel: req.session.usernivel,
      });
    }
  }

  static async delete(req, res) {
    const id = req.params.id;
    await Servico.destroy({ where: { id: id } });

    res.redirect("/listaservicos");
  }

  // Carrega o formulario de cadastro de serviços
  static async servico(req, res) {
    const tipo = await Tipo.findAll({ raw: true });
    res.render("silife/servico", {
      tipo: tipo,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }

  // Cadastra os serviços no banco
  static async servicoPost(req, res) {
    try {
      const {
        tipoId,
        name,
        taxa,
        tipodataxa,
        prazo,
        reducao_ano,
        idademax,
        idademxreducao,
        ltv,
        vmin,
      } = req.body;

      const valorMin = parseFloat(
        vmin.replace(/[^\d,-]/g, "").replace(",", ".")
      );
      const cad = {
        tipoId,
        name,
        taxa,
        tipodataxa,
        prazo,
        reducao_ano,
        idademax,
        idademxreducao,
        ltv,
        vmin: valorMin,
        vmax: 3000000,
      };
      console.dir(cad);

      // if (tipodataxa === "anual") {
      //   const taxaAnual = parseFloat(taxa) / 100; // Conversão para decimal
      //   const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1; // Taxa de juros mensal
      //   const taxaMensalFinal = (taxaMensal * 100).toFixed(2);
      //   cad.taxa = taxaMensalFinal;
      // }

      console.dir(cad);

      await Servico.create(cad);
      res.redirect("/servico");

    } catch (error) {
      console.error(error);
      // Envie a resposta com a flag de erro como JSON, se aplicável
      res.redirect("/servico");
    }
  }

  // API de Tipo que preenche /simulador/list/:id
  static async listarTipo(req, res) {
    const id = req.params.id;

    const servico = await Servico.findAll({
      include: Tipo,
      where: { tipoId: id },
    });

    res.json(servico);
  }

  // Carrega pagina do Formulario de Simulação
  static async simulador(req, res) {
    const tipo = await Tipo.findAll({ raw: true });

    res.render("silife/simulador", {
      tipo: tipo,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }

  // API de Tipo que preenche /simulador/ltv/:id
  static async listarServico(req, res) {
    const id = req.params.id;
    const ltv = await Servico.findOne({ include: Tipo, where: { id: id } });

    res.json(ltv);
  }

  static async simularPost(req, res) {
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
      tipoTaxa,
      ltvValor,
    } = req.body;

    const dados = {
      id: req.session.userid,
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
      tipoTaxa,
      ltvValor,
    };

    console.dir(dados);

    const simulacaoId = await cadSimula(dados);

    const tipoTexto = await Tipo.findOne({ where: { id: tipo } });
    const servicoTexto = await Servico.findOne({ where: { id: servico } });

    const dadosSimulados = {
      name,
      dataNascimento,
      tel,
      email,
      tipo: tipoTexto.tipo,
      servico: servicoTexto.name,
      parcela,
      ltv,
      vlrmx,
      vlrp,
      taxa: dados.taxa,
      tipoTaxa: servicoTexto.tipodataxa,
    };

    console.log(dadosSimulados);

    if (tipoTaxa === "anual") {
      const taxaAnual = parseFloat(dados.taxa) / 100; // Conversão para decimal
      const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1; // Taxa de juros mensal
      const taxaMensalFinal = (taxaMensal * 100).toFixed(2);
      dados.taxa = taxaMensalFinal;
    }


    const valorEmp = parseFloat(vlrp.replace(/[^\d,-]/g, "").replace(",", ".")); // Converte o valor do empréstimo para um número
    const numParcela = parseInt(parcela); // Converte o número de parcelas para um número
    const juros = parseFloat(dados.taxa); //  Converte a taxa de juros para um número
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
    console.log(data);
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

    res.render("silife/simular", {
      parcelas,
      dadosSimulados,
      simulacaoId,
      username: req.session.username,
      userNivel: req.session.usernivel,
    });
  }
  static async editsimulacao(req, res) {
    const id = req.params.id;
    const simulacao = await Simulacao.findOne({ raw: true, where: { id: id } });
    const idCliente = simulacao.ClienteId;
    const cliente = await Cliente.findOne({
      raw: true,
      where: { id: idCliente },
    });
    const nomeServico = simulacao.servico;
    const servico = await Servico.findOne({
      raw: true,
      where: { name: nomeServico },
    });

    const dataNascimentoObj = new Date(cliente.dataNascimento);
    const anoAtual = new Date().getFullYear();
    const idade = anoAtual - dataNascimentoObj.getFullYear();
    const dataFormatada = moment(cliente.dataNascimento).format("DD/MM/YYYY");

    let prazoParcela = servico.prazo;
    if (idade > servico.idademxreducao) {
      const prazo = 12;
      const parcelas = servico.prazo;
      const anos_reducao = servico.idademxreducao - idade;
      const quantidede_ano = prazo * anos_reducao;
      const resultFinal = parcelas + quantidede_ano;
      prazoParcela = resultFinal;
    }

    res.render("silife/editsimulacao", {
      username: req.session.username,
      userNivel: req.session.usernivel,
      simulacao,
      cliente,
      servico,
      prazoParcela,
      servico,
      dataFormatada,
    });
  }
  static async editsimulacaoPost(req, res) {
    const { vlrmx, vlrp, taxa, valorSimulacao, tipoTaxa, ltv, parcela } =
      req.body;

    const id = valorSimulacao;
    console.log(valorSimulacao);
    console.log(id);
    const simulacaoAtualizado = await Simulacao.update(
      { vlrmx: vlrmx, vlrp: vlrp, parcela: parcela },
      { where: { id: id } }
    );
    const simulacao = await Simulacao.findOne({ raw: true, where: { id: id } });
    const idCliente = simulacao.ClienteId;
    const cliente = await Cliente.findOne({
      raw: true,
      where: { id: idCliente },
    });

    const geraSimulacao = simulacao.id;
    const parcelas = await gerasimulacao(geraSimulacao);

    const dadosSimulados = {
      name: cliente.name,
      tipo: simulacao.tipo,
      parcela: simulacao.parcela,
      servico: simulacao.servico,
      vlrp: simulacao.vlrp,
      tipoTaxa: simulacao.tipodataxa,
      taxa: simulacao.taxa,
    };
    console.log(parcelas);
    const simulacaoId = simulacao.id;

    res.render("silife/simular", {
      username: req.session.username,
      userNivel: req.session.usernivel,
      parcelas,
      simulacaoId,
      dadosSimulados,
    });
  }
  static async deletesimulacao(req, res) {
    const id = req.params.id;
    const simulacao = await Simulacao.findOne({ raw: true, where: { id: id } });
    const idcliente = simulacao.ClienteId;
    const cliente = await Cliente.findOne({
      raw: true,
      where: { id: idcliente },
    });
    await Simulacao.destroy({ where: { id: id } });

    const idPesquisar = cliente.id;
    res.redirect("/perfilcliente/" + idPesquisar);
  }
};
