const formularioTarefa = document.getElementById("formulario-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");

const campoTitulo = document.getElementById("titulo-tarefa");
const campoDescricao = document.getElementById("descricao-tarefa");
const campoIdTarefa = document.getElementById("id-tarefa");
const botaoCancelar = document.getElementById("botao-cancelar");
const botaoEnviar = document.getElementById("botao-enviar");
const contadorTarefas = document.getElementById("contador-tarefas");
const mensagemStatus = document.getElementById("mensagem-status")

function mostrarMensagem(mensagem, erro = false) {
    mensagemStatus.textContent = mensagem;

    if (erro) {
        mensagemStatus.classList.add("erro");
    } else {
        mensagemStatus.classList.remove("erro");
    }
}

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

    contadorTarefas.textContent = `${tarefas.length} itens`;
    
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

            <div class="acoes-tarefa">
                <button class="botao-editar">Editar</button>
                <button class="botao-excluir">Excluir</button>
            </div>
        `;

        const botaoEditar = item.querySelector(".botao-editar");
        const botaoExcluir = item.querySelector(".botao-excluir");

        botaoEditar.addEventListener("click", () => {
            campoIdTarefa.value = tarefa.id;
            campoTitulo.value = tarefa.titulo;
            campoDescricao.value = tarefa.descricao;
        
            botaoEnviar.textContent = "Salvar alterações";
            botaoCancelar.classList.remove("escondido");
        });

        botaoExcluir.addEventListener("click", () => {
            deletarTarefa(tarefa.id);
        });

        listaTarefas.appendChild(item);
    });
}
listarTarefas();

async function criarTarefa(titulo,descricao) {
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
        mostrarMensagem("Tarefa criada com sucesso!");
        return true;
    }

    mostrarMensagem("Erro ao criar tarefa.", true);
    return false
}

async function deletarTarefa(id) {
    const response = await fetch(`/tarefas/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        await listarTarefas();
        mostrarMensagem("Tarefa excluída com sucesso!");
    } else {
        mostrarMensagem("Erro ao excluir tarefa.",true);
    }
}

async function atualizarTarefa(id,titulo,descricao) {
    const response = await fetch(`/tarefas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titulo,
            descricao
        })
    });

    if (response.ok) {
        mostrarMensagem("Tarefa atualizada com sucesso!");
        return true;
    }

    mostrarMensagem("Erro ao atualizar tarefa.", true);
    return false;

}
//=====================================================================================================//

formularioTarefa.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titulo = campoTitulo.value;
    const descricao = campoDescricao.value;
    const id = campoIdTarefa.value;

    let sucesso;

    if (id) {
        sucesso = await atualizarTarefa(id, titulo, descricao);
    } else {
        sucesso = await criarTarefa(titulo, descricao);
    }

    if (sucesso) {
        campoTitulo.value = "";
        campoDescricao.value = "";
        campoIdTarefa.value = "";

        botaoEnviar.textContent = "Adicionar tarefa";
        botaoCancelar.classList.add("escondido");

        await listarTarefas();
    }
});