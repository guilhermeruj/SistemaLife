const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id"); // Exibe o valor do parâmetro "id" no console

window.addEventListener("load", function () {
  setTimeout(function () {
    fetch(`https://silife.gkdata.com.br/simulaTable/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar as informações.");
        }
        return response.json();
      })
      .then((data) => {
        const tbodyPrincipal = document.getElementById("tbodyPrincipal");

        data.forEach((obj) => {
          const newRow = tbodyPrincipal.insertRow();

          Object.values(obj).forEach((value) => {
            const newCell = newRow.insertCell();
            const header = document.createElement("h6");
            header.className = "fw-semibold mb-0 tableBorde tableBorde";
            header.textContent = value;
            newCell.appendChild(header);
          });
        });
      })
      .catch((error) => {
        // Manipule o erro aqui e exiba uma mensagem adequada ao usuário
        console.error("Erro ao buscar as informações:", error.message);
      });

    console.log("Tipo foi completamente carregada!");
  }, 2000); // Tempo de espera em milissegundos (2 segundos)
});

window.addEventListener("load", function () {
  setTimeout(function () {
    fetch(`https://silife.gkdata.com.br/simulaCliente/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar as informações.");
        }
        return response.json();
      })
      .then((data) => {
        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const tel = document.getElementById("tel");
        const vlrEmp = document.getElementById("vlrEmp");
        const parcelas = document.getElementById("parcelas");
        const taxa = document.getElementById("taxa");
        name.textContent = data.cliente.name;
        email.textContent = data.cliente.email;
        tel.textContent = data.cliente.tel;
        vlrEmp.textContent = data.vlrp;
        parcelas.textContent = data.parcela;
        taxa.textContent = data.taxa;
      })
      .catch((error) => {
        // Manipule o erro aqui e exiba uma mensagem adequada ao usuário
        console.error("Erro ao buscar as informações:", error.message);
      });

    console.log("Tipo foi completamente carregada!");
  }, 2000); // Tempo de espera em milissegundos (2 segundos)
});
