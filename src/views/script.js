const formularioTarefa = document.getElementById("formulario-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");

const campoTitulo = document.getElementById("titulo-tarefa");
const campoDescricao = document.getElementById("descricao-tarefa");
const campoIdTarefa = document.getElementById("id-tarefa");
const botaoCancelar = document.getElementById("botao-cancelar");
const botaoEnviar = document.getElementById("botao-enviar");

async function buscarTarefas() {
    const response = await fetch("/tarefas");

    if (response.ok) {
        const dados = await response.json();
        return dados;
    }
    return [];
}

async function listarTarefas() {
    const dados = await buscarTarefas();
    const tarefas = dados.tarefas;

    listaTarefas.innerHTML = "";

    tarefas.forEach(tarefa => {
        const item = document.createElement("li");

        item.classList.add("item-tarefa");

        item.innerHTML = `
            <div class="conteudo-tarefa">
                <div>
                    <h3 class="titulo-tarefa">${tarefa.titulo}</h3>
                    <p class="descricao-tarefa">${tarefa.descricao}</p>
                </div>
            </div>
        `;

        listaTarefas.appendChild(item);
    });
}
listarTarefas();

formularioTarefa.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titulo = campoTitulo.value;
    const descricao = campoDescricao.value;

    const response = await fetch("/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titulo,
            descricao
        })
    });

    if (response.ok) {
        campoTitulo.value = "";
        campoDescricao.value = "";

        await listarTarefas();
    }
});