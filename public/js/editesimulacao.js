const valorImovel = document.getElementById("valorImovelformat");
const valorFinanciamento = document.getElementById("valorFinanciamento");
// Formata os valores
valorImovel.addEventListener("focus", function () {
  const valorFormatado = document.getElementById("valorImovelformat");
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
  }).mask(valorFormatado);
});

valorFinanciamento.addEventListener("focus", function () {
  const valorFinanciamentoFormatado = document.getElementById("valorFinanciamento");
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
  }).mask(valorFinanciamentoFormatado);
});

