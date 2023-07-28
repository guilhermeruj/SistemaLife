const btnGerarPDF = document.getElementById("gerarPdfBtn");

console.log(btnGerarPDF);
function gerarPDF(dadosFront) {
  // Obtém o elemento HTML que contém o conteúdo a ser incluído no PDF
  const elementoHTML = document.querySelector(".gerarpdf");

  // Compila o HTML para substituir as tags do Handlebars pelas informações reais
  const template = Handlebars.compile(elementoHTML.innerHTML);
  const conteudoCompilado = template({ dadosFront, parcelas }); // Substitua os dados pelos valores reais

  // Cria um elemento temporário para armazenar o conteúdo compilado
  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = conteudoCompilado;

  // Utiliza o html2pdf para converter o conteúdo em PDF e fazer o download
  html2pdf()
    .set({
      margin: 10,
      filename: "informacoes.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    })
    .from(tempContainer)
    .save();
}

// Adicione o evento de clique ao botão
btnGerarPDF.addEventListener("click", function () {
  console.log("entrou aqui");
  gerarPDF(dadosFront);
});
