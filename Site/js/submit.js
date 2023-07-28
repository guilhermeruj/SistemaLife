const formulario = document.getElementById("meuFormulario");

formulario.addEventListener("submit", (event) => {
  event.preventDefault(); // Impede o envio do formulário por padrão

  // Obtenha os dados do formulário
  const formData = new FormData(formulario);
  const data = Object.fromEntries(formData.entries());

  // Envie uma solicitação POST ao backend
  fetch("https://silife.gkdata.com.br/simularApi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      // Manipule a resposta do servidor aqui
      console.log(data);
      // Faça algo com os dados da simulação retornados pelo servidor
      window.location.href =
        "https://gkdata.com.br/simula/simulado.html?id=" + data;
    })
    .catch((error) => {
      // Trate erros de requisição aqui
      console.error("Erro:", error);
    });
});
