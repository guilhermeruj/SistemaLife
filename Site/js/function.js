// --------------------------- Faz o efeito de aparecer um a cada click -----------------------
const form1 = document.getElementById("form1");
const form2 = document.getElementById("form2");
const form3 = document.getElementById("form3");
const form4 = document.getElementById("form4");
const form5 = document.getElementById("form5");
const form6 = document.getElementById("form6");
const form7 = document.getElementById("form7");
const form8 = document.getElementById("form8");
const form9 = document.getElementById("form9");
const form10 = document.getElementById("form10");
const tipoCarrega = document.getElementById("tipo");

form1.addEventListener("focusin", () => {
  form2.style.display = "flex";
});

form2.addEventListener("focusin", () => {
  form3.style.display = "flex";
});

form3.addEventListener("focusin", () => {
  form4.style.display = "flex";
});

form4.addEventListener("focusin", () => {
  form5.style.display = "flex";
});

form5.addEventListener("focusin", () => {
  form6.style.display = "flex";
});

form6.addEventListener("focusin", () => {
  const valorCampo = document.getElementById("tipo").value;
  console.log(valorCampo);
  if (valorCampo === "4") {
    form7.style.display = "none";
    form8.style.display = "flex";
  } else {
    form7.style.display = "flex";
  }
});

// Apagar o campo de Imóvel caso seja empresarial
tipoCarrega.addEventListener("change", () => {
  const valorCampo = document.getElementById("tipo").value;
  console.log(valorCampo);
  if (valorCampo === "4") {
    form7.style.display = "none";
  } else {
    form7.style.display = "flex";
  }
});

form7.addEventListener("focusin", () => {
  form8.style.display = "flex";
});

form8.addEventListener("focusin", () => {
  form9.style.display = "flex";
});

form9.addEventListener("focusin", () => {
  form10.style.display = "flex";
});

// --------------------------- Configuração de Calculo -----------------------
const nameInput = document.getElementById("name");
const dataNascimentoInput = document.getElementById("dataNascimento");
const telInput = document.getElementById("tel");
const emailInput = document.getElementById("email");
const tipoSelect = document.getElementById("tipo");
const servicoSelect = document.getElementById("servico");
const vlrMxInput = document.getElementById("vlr-mx");
const vlrPInput = document.getElementById("vlr-p");
const parcelasInput = document.getElementById("parcelas");

var dadosUsar = "";
window.addEventListener("load", function () {
  setTimeout(function () {
    fetch("https://silife.gkdata.com.br/operacao")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar as informações.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        tipoSelect.innerHTML = "";
        tipoSelect.innerHTML += '<option value="">Selecione</option>';
        data.forEach((tipo) => {
          tipoSelect.innerHTML += `<option value="${tipo.id}">${tipo.tipo}</option>`;
        });
      })
      .catch((error) => {
        // Manipule o erro aqui e exiba uma mensagem adequada ao usuário
        console.error("Erro ao buscar as informações:", error.message);
      });

    console.log("Tipo foi completamente carregada!");
  }, 2000); // Tempo de espera em milissegundos (2 segundos)
});

tipoSelect.addEventListener("change", () => {
  const tipoSelectId = document.getElementById("tipo").value;
  fetch(`https://silife.gkdata.com.br/geraservicos/${tipoSelectId}`)
    .then((r) => {
      if (!r.ok) {
        // Verifica se a resposta não foi bem-sucedida de trate o status correspondente
        throw new Error("Erro os buscar as informações");
      }
      return r.json();
    })
    .then((datos) => {
      console.log(datos);
      servicoSelect.innerHTML = "";
      servicoSelect.innerHTML += "<option value=''>Selecione</option>";
      datos.forEach((servico) => {
        servicoSelect.innerHTML += `<option value="${servico.id}">${servico.name}</option>`;
      });
    })
    .catch((error) => {
      // Manipule o erro aqui e exiba uma mensagem adequada ao usuário
      console.error("Erro ao buscar as informações:", error.message);
    });
  // Seu código JavaScript aqui
  console.log("Servicos foi completamente carregada!");
});
// formatar alerte de LTV e Taxa
servicoSelect.addEventListener("change", () => {
  const servicoId = servicoSelect.value;
  fetch(`https://silife.gkdata.com.br/geraservicosone/${servicoId}`)
    .then((r) => {
      if (!r.ok) {
        // Verifica se a resposta não foi bem-sucedida de trate o status correspondente
        throw new Error("Erro os buscar as informações");
      }
      return r.json();
    })
    .then((servico) => {
      console.log(servico);
      dadosUsar = servico;
      // Apresenta o LTV
      const ltvAlert = document.getElementById("ltv2");
      const taxa = document.getElementById("taxa");
      const ltvApresentar = servico.ltv;
      ltvAlert.innerHTML = `O LTV máximo é de <b>${ltvApresentar}%</b></b>`;
      taxa.value = servico.taxa;
      const ltvValue = document.getElementById("ltv");
      ltvValue.value = servico.ltv;

      // FORMATAR PARCELAS
      const dataNascimento = document.getElementById("dataNascimento");
      const campoPrazo = document.getElementById("parcelas");
      const dataNascimentoValue = dataNascimento.value;
      const dataNascimentoObj = new Date(dataNascimentoValue);
      const anoAtual = new Date().getFullYear();
      const idade = anoAtual - dataNascimentoObj.getFullYear();
      vlrPInput.setAttribute("min", servico.vmin);
      if (idade > servico.idademx) {
        const prazo = servico.reducao_ano;
        const parcelas = servico.prazo;
        const anos_reducao = servico.idademx - idade;
        const quantidede_ano = prazo * anos_reducao;
        const resultFinal = parcelas + quantidede_ano;

        campoPrazo.setAttribute("max", resultFinal);

        const qtdParcela = document.getElementById("qtdParcela");
        qtdParcela.style.display = "block";
        qtdParcela.innerHTML = `O prazo máximo é de <b>${resultFinal}</b>`;
      } else {
        const prazo = servico.prazo;
        campoPrazo.setAttribute("max", prazo);
        const qtdParcela = document.getElementById("qtdParcela");
        qtdParcela.style.display = "block";
        qtdParcela.innerHTML = `O prazo máximo é de <b>${prazo}</b>`;
      }
    })
    .catch((error) => {
      // Manipule o erro aqui e exiba uma mensagem adequada ao usuário
      console.error("Erro ao buscar as informações:", error.message);
    });
  // Seu código JavaScript aqui
  console.log("Serviço foi completamente carregada!");
});
// Muda o nome de imovel para Veiculo
servicoSelect.addEventListener("change", () => {
  const servicoSelecioando =
    servicoSelect.options[servicoSelect.selectedIndex].text;
  const label = document.getElementById("campoValorVeiculo");

  label.textContent =
    servicoSelecioando.includes("Veiculo") ||
    servicoSelecioando.includes("Automovel") ||
    servicoSelecioando.includes("Carro")
      ? "Valor do Veiculo:"
      : "Valor do Imóvel:";
});

// Adiciona o evento "change" ao campo "Valor Total" para calculo do valor de LTV
vlrPInput.addEventListener("focus", function () {
  // Trás os elementos alvo
  const ltvPermt = document.getElementById("ltvPermt");
  const porcentagem = dadosUsar.ltv; // Puxa o valor do LTV.
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
      ltvPermt.innerHTML = `Valor minimo deve ser de <b>${formatvalorMin}</b>`;
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
      ltvPermt.innerHTML = `Maximo para esse ele LTV <b>${vlrformatado}</b>`;
    }
  }
});

// Formata os valores
vlrPInput.addEventListener("focus", function () {
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

vlrMxInput.addEventListener("focus", function () {
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
  }).mask(vlrMxInput);
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
