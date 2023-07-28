const Decimal = require("decimal.js");

function price(valorPresente, taxaJuros, tempo) {
  taxaJuros = taxaJuros / 100;
  var base = Math.pow(1 + taxaJuros, tempo);
  var parcela = (valorPresente * taxaJuros * base) / (base - 1);
  return parcela;
}

// Função para formatar um número como valor monetário
function monetario(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

module.exports = {
  price,
  monetario,
};
