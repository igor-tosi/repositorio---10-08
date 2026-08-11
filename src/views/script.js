const formularioTarefa = document.getElementById("formulario-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");
const campoTitulo = document.getElementById("titulo-tarefa");
const campoDescricao = document.getElementById("descricao-tarefa");
const campoIdTarefa = document.getElementById("id-tarefa");
const botaoCancelar = document.getElementById("botao-cancelar");
const botaoEnviar = document.getElementById("botao-enviar");


async function buscarTarefas(){
    const response = await fetch ("/tarefas");
    
    if (response.ok) {
        const dados = await response.json();
        console.log(dados)
    }
};
buscarTarefas()