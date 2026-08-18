const express = require("express");
const { conectarBancoDeDados } = require("./db/connection");

const router = express.Router()



router.get('/tarefas', async (req, res) => {
    const bancoDeDados = await conectarBancoDeDados();

    const tarefas = await bancoDeDados.all("SELECT * FROM tarefas")

    return res.status(200).json({
        tarefas: tarefas
    })
})

router.post('/tarefas', async (req, res) => {
    const { titulo, descricao } = req.body;

    if (!titulo) {
        return res.status(400).json({ mensagem: "Titulo é obrigatório"})
    }

    const bancoDeDados = await conectarBancoDeDados();

    const novaTarefa = {
        titulo,
        descricao,
        feito: false
    }

    await bancoDeDados.run(
        "INSERT INTO tarefas(titulo, descricao, feito) VALUES(?, ?, ?)", 
        [novaTarefa.titulo, novaTarefa.descricao, novaTarefa.feito]
    )

    return res.status(201).json({
        mensagem: "Tarefa criada com sucesso",
        tarefaCriada: novaTarefa
    })
})

router.put('/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, feito } = req.body;

    const bancoDeDados = await conectarBancoDeDados();

    const tarefaSolicitadaPeloUsuario = await bancoDeDados.get("SELECT * FROM tarefas WHERE id = ?", [id]);

    if (!tarefaSolicitadaPeloUsuario) {
        return res.status(400).json({ mensagem: "Tarefa não existe"})
    }

    const tituloVerificado = !titulo ? tarefaSolicitadaPeloUsuario.titulo : titulo
    const descricaoVerificado = !descricao ? tarefaSolicitadaPeloUsuario.descricao : descricao
    const feitoVerificado = !feito ? tarefaSolicitadaPeloUsuario.feito : feito

    await bancoDeDados.run(
        "UPDATE tarefas SET titulo = ?, descricao = ?, feito = ? WHERE id = ?",
        [tituloVerificado, descricaoVerificado, feitoVerificado, id]
    )

    return res.status(200).json({
        mensagem: "Tarefa atualizada com sucesso",
        tarefaAtualizada: {
            titulo: tituloVerificado,
            descricao: descricaoVerificado,
            feito: feitoVerificado
        }
    })
})

router.delete('/tarefas/:id', async (req, res) => {
    const { id } = req.params;

    const bancoDeDados = await conectarBancoDeDados();

    await bancoDeDados.run("DELETE FROM tarefas WHERE id = ?", [id])

    return res.status(200).json({ mensagem: "Tarefa deletada" });
})

module.exports = router;