const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function conectarBancoDeDados() {
    const conexaoAbertaComOBanco = await open({
        filename: "./src/db/banco.db",
        driver: sqlite3.Database
    });

    await conexaoAbertaComOBanco.exec(`
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            feito INTEGER NOT NULL DEFAULT 0
        )
    `);

    return conexaoAbertaComOBanco;
}

module.exports = {
    conectarBancoDeDados
};