const Tipo = require("../models/Tipo");
const Servico = require("../models/Servico");
const Cliente = require("../models/Clientes");
const Simulacao = require("../models/Simulacao");

async function cadSimula(dados) {
  const tipo = dados.tipo.toString();
  const email = dados.email.toString();
  const servico = dados.servico.toString();

  const tipoTexto = await Tipo.findOne({ where: { id: tipo } });
  const servicoTexto = await Servico.findOne({ where: { id: servico } });
  const clienteExist = await Cliente.findOne({ where: { email: email } });

  const clientes = {
    name: dados.name,
    dataNascimento: dados.dataNascimento,
    tel: dados.tel,
    email: dados.email,
    indicar: "Não",
    UserId: dados.id,
  };

  let simulacaoRl;
  let simulacaoId;

  if (!clienteExist) {
    const novoCliente = await Cliente.create(clientes);
    simulacaoRl = {
      tipo: tipoTexto.tipo,
      servico: servicoTexto.name,
      parcela: dados.parcela,
      vlrmx: dados.vlrmx,
      vlrp: dados.vlrp,
      taxa: dados.taxa,
      tipodataxa: dados.tipoTaxa,
      situacao: "Não indicado",
      analize: "Pendente",
      ClienteId: novoCliente.id,
    };
    console.log("Dados" + simulacaoRl);
    const simulacao = await Simulacao.create(simulacaoRl);
    simulacaoId = simulacao.id;
    console.log("Salvo cliente e simulação");
  } else {
    simulacaoRl = {
      tipo: tipoTexto.tipo,
      servico: servicoTexto.name,
      parcela: dados.parcela,
      vlrmx: dados.vlrmx,
      vlrp: dados.vlrp,
      taxa: dados.taxa,
      tipodataxa: dados.tipoTaxa,
      situacao: "Não indicado",
      analize: "Aberto",
      ClienteId: clienteExist.id,
    };
    console.log("Imprimiu sem salvar o contato " + simulacaoRl);
    const simulacao = await Simulacao.create(simulacaoRl);
    simulacaoId = simulacao.id;
    console.log("Apenas simulação");
  }
  return simulacaoId;
}
module.exports = cadSimula;
