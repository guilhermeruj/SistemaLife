const formatarValorMonetario = (valor) => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatarValorDecimal = (valor, casasDecimais) => {
  return valor.toFixed(casasDecimais).replace('.', ',');
};

const dados = {
  contar: 5,
  valorEmp: 0.020565455261930765,
  armotizar: 6154.783033572542,
  descJuros: 79.39696642745821,
  taxaSeguroMIP: 1.3008177406545656,
  taxaDIF: 1.110000000000582,
  taxaADM: 25,
  parcelaFinal: '62341811.110000000000582251.3008177406545656'
};

dados.valorEmp = formatarValorMonetario(dados.valorEmp);
dados.armotizar = formatarValorMonetario(dados.armotizar);
dados.descJuros = formatarValorMonetario(dados.descJuros);
dados.taxaSeguroMIP = formatarValorMonetario(dados.taxaSeguroMIP);
dados.taxaDIF = formatarValorMonetario(dados.taxaDIF);
dados.taxaADM = formatarValorMonetario(dados.taxaADM);

const parcelaFinalSemPontuacao = parseFloat(dados.parcelaFinal.replace(/\./g, '').replace(/,/g, '.'));
dados.parcelaFinal = formatarValorMonetario(parcelaFinalSemPontuacao);

console.log(dados);


function price(valor, parcelas, juros) {
  juros = new Decimal(juros).dividedBy(100);
  const taxa = juros.plus(1).pow(parcelas);
  const valorParcela = new Decimal(valor)
    .times(juros)
    .times(taxa)
    .dividedBy(taxa.minus(1));

  return valorParcela.toFixed(2);
}