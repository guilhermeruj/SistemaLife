function calcularParcela(valorPresente, taxaJuros, tempo) {
  taxaJuros = taxaJuros / 100;
  var base = Math.pow(1 + taxaJuros, tempo);
  var parcela = (valorPresente * taxaJuros * base) / (base - 1);
  parcela = parcela.toFixed(2);
  return parcela;
}

// Solicitar valores ao usuário
var vlrp = "R$ 30.000,00";
var taxa = "1.29";
var parcela = "5";

const valorPresente = parseFloat(vlrp.replace(/[^\d,-]/g, "").replace(",", ".")); // Converte o valor do empréstimo para um número
const taxaJuros = parseFloat(taxa); // Converte a taxa de juros para um número
const tempo = parseInt(parcela); // Converte o número de parcelas para um número

console.log("Apresentação 1", valorPresente, taxaJuros, tempo);

var resultado = calcularParcela(valorPresente, taxaJuros, tempo);
console.log("O valor da parcela é: R$" + resultado);

var valorPresente2 = 30000;
var taxaJuros2 = 1.29;
var tempo2 = 5;

console.log("Apresentação 2", valorPresente2, taxaJuros2, tempo2);

var resultado2 = calcularParcela(valorPresente2, taxaJuros2, tempo2);
console.log("O valor da parcela é: R$" + resultado2);