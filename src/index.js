const express = require("express");
const rotas = require("./routes");
const path = require("path");
const { conectarBancoDeDados } = require("./db/connection");
const { middlewareDeAutenticacao } = require("./middlewares");

const app = express();

conectarBancoDeDados();

app.use(express.json());

app.use(express.static(path.join(__dirname, "views")));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

//app.use(middlewareDeAutenticacao);

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"))
})

app.use("/", rotas);

app.listen(3000, () => {
    console.log("Servidor rodando!");
});