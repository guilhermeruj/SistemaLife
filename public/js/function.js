// Variaveis do Simulador
const tipoSelect = document.querySelector("#tipo");
const servicoSelect = document.querySelector("#servico");
const ltv2 = document.querySelector("#ltv2");
const valorTotal = document.querySelector("#vlr-p");
const vlmin = document.getElementById("vlmin");
const campoPrazo = document.getElementById("parcelas");
const qtdParcela = document.getElementById("qtdParcela");
const ltvValue = document.getElementById("ltvValor");
const taxa = document.getElementById("taxa");
const tipotaxa = document.getElementById("tipoTaxa");
const listas = document.getElementById("");
const vlrInputImovel = document.getElementById("vlr-mx");
const telefoneInput = document.getElementById("tel");

var dataServico = {};

telefoneInput.addEventListener("input", function () {
  const valorTel = this.value;

  // Remove todos os caracteres não numéricos
  const apenasDigitos = valorTel.replace(/\D/g, "");

  // Verifica o tamanho máximo do número
  const tamanhoMaximo = 11; // Altere para o tamanho máximo desejado

  // Limita o tamanho do número
  const digitosLimitados = apenasDigitos.slice(0, tamanhoMaximo);

  // Aplica a máscara
  let telefoneFormatado = "";
  for (let i = 0; i < digitosLimitados.length; i++) {
    if (i === 0) {
      telefoneFormatado += "(";
    } else if (i === 2) {
      telefoneFormatado += ") ";
    } else if (i === 7) {
      telefoneFormatado += "-";
    }
    telefoneFormatado += digitosLimitados[i];
  }

  this.value = telefoneFormatado;
});

// Carrega os serviços
tipoSelect.addEventListener("change", () => {
  const tipoId = tipoSelect.value;
  fetch(`/listarTipo/${tipoId}`)
    .then((response) => response.json())
    .then((servico) => {
      servicoSelect.innerHTML = "";
      servicoSelect.innerHTML += '<option value="">Selecione</option>';
      servico.forEach((servicos) => {
        servicoSelect.innerHTML += `<option value="${servicos.id}">${servicos.name}</option>`;
      });
    })
    .catch((err) => console.log(err));
});

servicoSelect.addEventListener("change", function () {
  valorTotal.value = "";
  vlrInputImovel.value = "";
  campoPrazo.value = "";
  ltv2.style.display = "none";
  qtdParcela.style.display = "none";
  const ltvPermt = document.getElementById("ltvPermt");
  ltvPermt.style.display = "none";
});

// Monta o select dos Serviços
servicoSelect.addEventListener("change", () => {
  const servicoId = servicoSelect.value;
  fetch(`/listarServico/${servicoId}`)
    .then((response) => response.json())
    .then((ltv) => {
      dataServico = ltv;
      if (ltv && ltv.id) {
        // Apresenta o LTV
        const ltvApresentar = ltv.ltv;
        ltv2.style.display = "block";
        ltv2.innerHTML = `LTV máximo <b>${ltvApresentar}%</b></b>`;
        taxa.value = ltv.taxa;
        tipotaxa.value = ltv.tipodataxa;
        const ltvValue = document.getElementById("ltvValor");
        ltvValue.value = ltvApresentar;
        valorTotal.setAttribute("min", ltv.vmin);
        console.log(ltv.idademxreducao);
        // FORMATAR PARCELAS
        const dataNascimento = document.getElementById("dataNascimento");
        const dataNascimentoValue = dataNascimento.value;
        const campoPrazo = document.getElementById("parcelas");
        const dataNascimentoObj = new Date(dataNascimentoValue);
        const anoAtual = new Date().getFullYear();
        const idade = anoAtual - dataNascimentoObj.getFullYear();
        const btSubmit = document.getElementById("btSubmit");
        if (idade > ltv.idademxreducao) {
          // bloqueia o submit
          if (idade > ltv.idademax) {
            alert(
              `Idade máxima do cliente para este serviço é de ${ltv.idademax} anos!`
            );
            if (!btSubmit.hasAttribute("disabled")) {
              btSubmit.setAttribute("disabled", ""); // Define o valor do atributo como uma string vazia
            }
          } else {
            const prazo = 12;
            const parcelas = ltv.prazo;
            const anos_reducao = ltv.idademxreducao - idade;
            const quantidede_ano = prazo * anos_reducao;
            const resultFinal = parcelas + quantidede_ano;

            campoPrazo.setAttribute("max", resultFinal);

            const qtdParcela = document.getElementById("qtdParcela");
            qtdParcela.style.display = "block";
            qtdParcela.innerHTML = `O prazo máximo <b>${resultFinal}</b>`;
            if (btSubmit.hasAttribute("disabled")) {
              btSubmit.removeAttribute("disabled", "");
            }
          }
        } else {
          const prazo = ltv.prazo;
          campoPrazo.setAttribute("max", prazo);
          const qtdParcela = document.getElementById("qtdParcela");
          qtdParcela.style.display = "block";
          qtdParcela.innerHTML = `O prazo máximo <b>${prazo}</b>`;
          if (btSubmit.hasAttribute("disabled")) {
            btSubmit.removeAttribute("disabled", "");
          }
        }
      }
    });
  // Caso o seja escolhido empresarial oculta o campo de valorImovel
  if (servicoId === "6") {
    const valorImovel = document.querySelector("#valorImovel");
    valorImovel.style.display = "none";
  } else {
    const valorImovel = document.querySelector("#valorImovel");
    valorImovel.style.display = "block";
  }
});

servicoSelect.addEventListener("change", () => {
  const novoLabel = document.getElementById("campoValorVeiculo");
  const valorSelect = servicoSelect.options[servicoSelect.selectedIndex].text;

  novoLabel.textContent =
    valorSelect.includes("Veiculo") ||
    valorSelect.includes("Veículo") ||
    valorSelect.includes("Automovel") ||
    valorSelect.includes("Carro")
      ? "Valor do Veículo:"
      : "Valor do Imóvel:";
});

// Adiciona o evento "change" ao campo "Valor Total"
valorTotal.addEventListener("focus", function () {
  // Trás os elementos alvo
  const ltvPermt = document.getElementById("ltvPermt");
  const porcentagem = dataServico.ltv; // Puxa o valor do LTV.
  console.log(porcentagem);
  const valorBase = document.getElementById("vlr-mx").value; //Valor de Base de valor de imovel/garantia
  const vlrPInput = document.getElementById("vlr-p"); // Adiciona essa linha para obter o elemento alvo
  const valorMin = vlrPInput.min;
  // Faz os calculos
  const valorNumerico = parseFloat(
    valorBase.replace(/[^\d,]/g, "").replace(",", ".")
  );
  console.log(valorNumerico, valorMin);
  if (valorBase && porcentagem) {
    if (valorNumerico <= valorMin) {
      const formatvalorMin = formatarValor(valorMin);
      ltvPermt.style.display = "block";
      ltvPermt.innerHTML = `Valor minimo <b>${formatvalorMin}</b>`;
    } else {
      console.log(valorBase);
      console.log(valorNumerico); //Formata o valor.
      const resultado = valorNumerico * (porcentagem / 100);
      console.log(resultado); // calcula o valor com base na porcentagem
      const resultadoFinal = parseInt(resultado); // Converte em Inteiro
      const vlrformatado = formatarValor(resultadoFinal); // Atualiza o atributo max do elemento
      // Monta a div para mostrar o alert
      ltvPermt.style.display = "block";
      vlrPInput.setAttribute("max", resultado);
      ltvPermt.innerHTML = `Valor máximo <b>${vlrformatado}</b>`;
    }
  }
});

// Formata os valores
valorTotal.addEventListener("focus", function () {
  const vlrPInput = document.getElementById("vlr-p");
  Inputmask("numeric", {
    radixPoint: ",",
    groupSeparator: ".",
    digits: 2,
    autoGroup: true,
    prefix: "R$ ",
    placeholder: "0,00",
    numericInput: true, // Adicione essa linha para habilitar a entrada numérica
    onBeforeMask: function (value, opts) {
      // Adiciona ".00" para valores inteiros
      const parts = value.split(",");
      if (parts.length === 1 && value !== "") {
        value += ",00";
      }
      return value;
    },
  }).mask(vlrPInput);
});

vlrInputImovel.addEventListener("focus", function () {
  Inputmask("numeric", {
    radixPoint: ",",
    groupSeparator: ".",
    digits: 2,
    autoGroup: true,
    prefix: "R$ ",
    placeholder: "0,00",
    numericInput: true, // Adicione essa linha para habilitar a entrada numérica
    onBeforeMask: function (value, opts) {
      // Adiciona ".00" para valores inteiros
      const parts = value.split(",");
      if (parts.length === 1 && value !== "") {
        value += ",00";
      }
      return value;
    },
  }).mask(vlrInputImovel);
});

function calcularParcelasDisponiveis(anoNascimento, parcela, reducao) {
  const anoAtual = new Date().getFullYear();
  const idade = anoAtual - anoNascimento;

  let parcelasDisponiveis = anoAtual - anoNascimento;

  return parcelasDisponiveis;
}

// Função que trava os campos
function desbloqueiaCampo() {
  tipoSelect.innerHTML += "";
  servicoSelect.innerHTML = "";
  taxa.value = "";

  if (
    qtdParcela.style.display === "block" ||
    qtdParcela.style.display === "block" ||
    vlmin.style.display === "block"
  ) {
    qtdParcela.style.display = "none";
    ltv2.style.display = "none";
    vlmin.style.display = "none";
  }
  campoPrazo.setAttribute("max", "");
}

// Função para formatar a data
function formatarData(data) {
  const options = { month: "short", day: "2-digit", year: "numeric" };
  return new Date(data).toLocaleDateString("en-US", options);
}

function formatarValor(valor) {
  // Converte o valor para uma string e remove caracteres indesejados
  var strValor = String(valor).replace(/\D/g, "");
  // Formata a string adicionando separadores de milhar e decimal
  var valorFormatado = parseFloat(strValor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // Retorna o valor formatado com o símbolo "R$"
  return "R$ " + valorFormatado;
}
