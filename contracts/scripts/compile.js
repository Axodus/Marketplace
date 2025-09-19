// Pequeno wrapper programático para compilar contratos e imprimir o resultado claramente
// Útil quando o ambiente não captura stdout do "npx hardhat compile"
// Registra ts-node para carregar hardhat.config.ts
require('ts-node/register/transpile-only');
require('dotenv').config();
const fs = require('fs');

async function main() {
  try {
    const hh = require('hardhat');
    console.log('[compile] Iniciando compilação...');
    await hh.run('clean');
    await hh.run('compile');
    console.log('[compile] Compilação concluída com sucesso.');
    fs.writeFileSync('compile.status', 'OK');
    process.exit(0);
  } catch (err) {
    console.error('[compile] Falha na compilação:', err);
    try {
      const details = (err && err.stack) ? err.stack : String(err);
      fs.writeFileSync('compile.status', 'ERROR\n' + details);
    } catch {}
    process.exit(1);
  }
}

main();
