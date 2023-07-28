const fs = require('fs');
const path = require('path');

function listarDiretorio(diretorio, nivel = 0, arquivoSaida) {
  const prefixo = ' '.repeat(nivel * 4);
  const arquivos = fs.readdirSync(diretorio);

  arquivos.forEach(arquivo => {
    const caminhoCompleto = path.join(diretorio, arquivo);
    const estatisticas = fs.statSync(caminhoCompleto);

    if (estatisticas.isDirectory()) {
      const linha = `${prefixo}[${arquivo}] (Pasta)\n`;
      fs.appendFileSync(arquivoSaida, linha);
      listarDiretorio(caminhoCompleto, nivel + 1, arquivoSaida);
    } else {
      const linha = `${prefixo}${arquivo} (Arquivo)\n`;
      fs.appendFileSync(arquivoSaida, linha);
    }
  });
}

const diretorioRaiz = 'C:/xampp/htdocs/SisLife'; // Substitua pelo caminho do diretório que deseja listar
const arquivoSaida = './mapa_diretorio.txt'; // Caminho do arquivo de saída

fs.writeFileSync(arquivoSaida, `Mapa do diretório: ${diretorioRaiz}\n\n`);
listarDiretorio(diretorioRaiz, 0, arquivoSaida);

console.log(`Arquivo gerado com sucesso: ${arquivoSaida}`);
