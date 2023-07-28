const Tipo = require("../models/Tipo");
const Servico = require("../models/Servico");
const bodyParser = require("body-parser");
const { price, monetario } = require("../functions/price");
const Simulacao = require("../models/Simulacao");
const Cliente = require("../models/Clientes");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const logoFundo = "./img/logo-fundo.png";

module.exports = class pdfController {
  static async gerarPdf(req, res) {
    const id = req.params.id;
    const dados = await Simulacao.findOne({ raw: true, where: { id: id } });
    const clienteId = dados.ClienteId;
    const cliente = await Cliente.findOne({
      raw: true,
      where: { id: clienteId },
    });

    const vlrp = dados.vlrp;
    const parcela = dados.parcela;
    let taxa = dados.taxa;
    const taxaViews = dados.taxa;
    const tipodataxa = dados.tipodataxa;
    const nasc = cliente.dataNascimento;

    const dataNascimentoObj = new Date(nasc);
    // const idade = dataNascimentoObj.getFullYear();
    const dataFormatada = moment(dataNascimentoObj).format("DD/MM/YYYY");

    if (tipodataxa === "anual") {
      const taxaAnual = parseFloat(taxa) / 100; // Conversão para decimal
      const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1; // Taxa de juros mensal
      const taxaMensalFinal = (taxaMensal * 100).toFixed(2);
      taxa = taxaMensalFinal;
    }

    const valorEmp = parseFloat(vlrp.replace(/[^\d,-]/g, "").replace(",", ".")); // Converte o valor do empréstimo para um número
    const numParcela = parseInt(parcela); // Converte a taxa de juros para um número
    const juros = parseFloat(taxa); // Converte o número de parcelas para um número
    const seguroMip1 = 0.021135 / 100 + 1;

    const data = {
      parcela: numParcela,
      valorEmp: valorEmp,
      juros: juros,
      seguroMip: seguroMip1,
      vlrDFI: 0.0037 / 100 + 1,
      taxaADM: 25,
      contar: 1,
      vlrParcelafixa: price(valorEmp, juros, numParcela), // Calcula o valor fixo da parcela com base nos parâmetros
    };

    // Seguros
    data.taxaDIF = data.valorEmp * data.vlrDFI - data.valorEmp; // Calcula a taxa DIF
    const parcelas = [];
    let valorParcelaCorrente = data.valorEmp;

    while (data.contar <= data.parcela) {
      // Seguros
      data.taxaSeguroMIP =
        valorParcelaCorrente * data.seguroMip - valorParcelaCorrente; // Calcula a taxa do seguro MIP
      data.parcelaFinal =
        data.vlrParcelafixa + data.taxaDIF + data.taxaADM + data.taxaSeguroMIP; // Calcula o valor final da parcela

      const taxa = data.juros / 100 + 1;
      const descJuros = valorParcelaCorrente * taxa - valorParcelaCorrente; // Calcula o valor dos juros descontados
      const armotizar = data.vlrParcelafixa - descJuros; // Calcula o valor a ser amortizado do empréstimo

      valorParcelaCorrente -= armotizar; // Atualiza o valor da parcela corrente subtraindo o valor amortizado

      parcelas.push({
        contar: data.contar,
        valorEmp: monetario(valorParcelaCorrente), // Valor da parcela corrigido aqui
        armotizar: monetario(armotizar),
        descJuros: monetario(descJuros),
        taxaSeguroMIP: monetario(data.taxaSeguroMIP),
        taxaDIF: monetario(data.taxaDIF),
        taxaADM: monetario(data.taxaADM),
        parcelaFinal: monetario(data.parcelaFinal),
      });

      data.contar++;
    }
    let tipodataxaDef
    if (tipodataxa === "anual"){
      tipodataxaDef = "a.a"
    }else{
      tipodataxaDef = "a.m"
    }
    // Configuração do tamanho do documento para A4
    const options = {
      size: "A4",
      margin: 50,
    };

    // Criação do documento PDF com as opções definidas
    const doc = new PDFDocument(options);

    // Carrega a logo da empresa
    const empresaLogo = "./img/logo.png";
    const rodaPeLogo = "./img/roda-pe.png";
    const cabeçalho = "./img/cabecalho-pdf.png";

    // Adicionar logo da empresa
    const logoEmpresa = doc.openImage(empresaLogo);
    doc.image(logoEmpresa, 130, 15, { width: 80 });

    // cabeçalho
    const cabecalhoLogo = doc.openImage(cabeçalho);
    doc.image(cabecalhoLogo, 15, -10, { width: 540 });

    // Fundo
    const fundoLogo = doc.openImage(logoFundo);
    doc.image(fundoLogo, { width: 520 });

    const nomeCliente = cliente.name;
    const telCliente = cliente.tel;
    const emailCliente = cliente.email;
    const tipo = dados.tipo;
    const servico = dados.servico;

    const cinza = "#313131";

    doc
      .fillColor(cinza)
      .font("Helvetica-Bold")
      .fontSize(13)
      .text("Simulação de Crédito", 350, 35);

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(nomeCliente, 90, 113)
      .text(dataFormatada, 125, 132)
      .text(emailCliente, 91, 151)
      .text(telCliente, 112, 170)
      .text(`${tipo} ${servico}`, 378, 114)
      .text(vlrp, 397, 133)
      .text(`${taxaViews}% ${tipodataxaDef}`, 344, 152)
      .text(parcela, 350, 171);

    // Criação das tabelas com os resultados
    doc.fontSize(9);

    // Tabela de cabeçalho
    doc.font("Helvetica-Bold");
    doc.text("N°.", 30, 200, { width: 50, align: "left" });
    doc.text("Saldo Devedor", 80, 200, { width: 80, align: "left" });
    doc.text("Amortização", 178, 200, { width: 70, align: "left" });
    doc.text("Juros", 275, 200, { width: 50, align: "left" });
    doc.text("Seguro MIP", 330, 200, { width: 80, align: "left" });
    doc.text("Seguro DFI", 390, 200, { width: 60, align: "left" });
    doc.text("Taxa ADM", 445, 200, { width: 60, align: "left" });
    doc.text("Prestação", 505, 200, { width: 80, align: "left" });
    doc.moveDown();

    doc.font("Helvetica");

    // Definir o espaçamento entre as linhas
    const lineHeight = 14;

    // Coordenadas x e y iniciais da tabela
    let x = 25;
    let y = 197 + lineHeight;

    // Definir largura da linha de borda
    const borderWidth = 1;

    // Definir cor da linha de borda (opcional)
    doc.strokeColor("black");

    // Iteração sobre as parcelas
    for (const parcela of parcelas) {
      // Preencher o conteúdo da célula
      doc.text(parcela.contar.toString(), x + 2, y + 5); // n°
      doc.text(parcela.valorEmp.toString(), x + 45, y + 5); // Saldo Devedor
      doc.text(parcela.armotizar.toString(), x + 150, y + 5); //Amortização
      doc.text(parcela.descJuros.toString(), x + 235, y + 5); //Juros
      doc.text(parcela.taxaSeguroMIP.toString(), x + 315, y + 5); //Seguro MIP
      doc.text(parcela.taxaDIF.toString(), x + 375, y + 5); //Taxa DIF
      doc.text(parcela.taxaADM.toString(), x + 425, y + 5); // Taxa ADM
      doc.text(parcela.parcelaFinal.toString(), x + 475, y + 5, { width: 80 }); // Prestação

      y += lineHeight; // Aumentar a posição vertical para a próxima linha
      // Desenhar as bordas da célula
      doc
        .lineWidth(borderWidth)
        .rect(x, y - lineHeight, 40, lineHeight)
        .rect(x + 40, y - lineHeight, 100, lineHeight)
        .rect(x + 140, y - lineHeight, 80, lineHeight)
        .rect(x + 220, y - lineHeight, 80, lineHeight)
        .rect(x + 300, y - lineHeight, 60, lineHeight)
        .rect(x + 360, y - lineHeight, 55, lineHeight)
        .rect(x + 415, y - lineHeight, 55, lineHeight)
        .rect(x + 470, y - lineHeight, 80, lineHeight)
        .stroke();

      // Verificar se há espaço suficiente para outra linha
      if (y + lineHeight + 50 > doc.page.height - doc.page.margins.bottom) {
        const imageWidth = 595.28; // Largura da página A4 em pontos
        const imageHeight = (192 / 2480) * imageWidth; // Proporção de aspecto da imagem
        const imageX = (doc.page.width - imageWidth) / 2; // Alinhamento horizontal
        const imageY = doc.page.height - imageHeight - 40; // Posição vertical ajustável
        doc.image(rodaPeLogo, imageX, imageY, { width: imageWidth });
        doc.addPage(); // Adicionar nova página
        y = 40; // Redefinir posição vertical para a nova página
        const fundoLogo = doc.openImage(logoFundo);
        doc.image(fundoLogo, { width: 520 });
        // Tabela de cabeçalho
        doc.font("Helvetica-Bold");
        doc.text("N°.", 30, 30, { width: 50, align: "left" });
        doc.text("Saldo Devedor", 80, 30, { width: 80, align: "left" });
        doc.text("Amortização", 178, 30, { width: 70, align: "left" });
        doc.text("Juros", 275, 30, { width: 50, align: "left" });
        doc.text("Seguro MIP", 330, 30, { width: 80, align: "left" });
        doc.text("Seguro DFI", 390, 30, { width: 60, align: "left" });
        doc.text("Taxa ADM", 445, 30, { width: 60, align: "left" });
        doc.text("Prestação", 505, 30, { width: 80, align: "left" });
        doc.moveDown();

        doc.font("Helvetica");
      }
    }
    const imageWidth = 595.28; // Largura da página A4 em pontos
    const imageHeight = (192 / 2400) * imageWidth; // Proporção de aspecto da imagem
    const imageX = (doc.page.width - imageWidth) / 2; // Alinhamento horizontal
    const imageY = doc.page.height - imageHeight - 40; // Posição vertical ajustável
    doc.image(rodaPeLogo, imageX, imageY, { width: imageWidth });

    const fileName = "resultado.pdf";
    const filePath = path.join(__dirname, fileName);

    res.set("Content-Type", "application/pdf"); // Define o cabeçalho do tipo de conteúdo como PDF

    doc.pipe(res); // Envia o documento PDF diretamente para a resposta

    doc.end();
  }
};
