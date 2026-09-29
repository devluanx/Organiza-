let tarefas = [];

const formulario = document.getElementById("formTarefa");
const tituloDaTarefa = document.getElementById("tituloDaTarefa");
const listaDasTarefas = document.getElementById("listaDasTarefas");
const mensagem = document.getElementById("mensagem");

function carregarTarefas() {
  const dados = localStorage.getItem("tarefas");

  if (dados) {
    tarefas = JSON.parse(dados);
  } else {
    tarefas = [];
  }
}

function salvarTarefas() {
  
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function adicionarTarefa() {
  const titulo = tituloDaTarefa.value.trim();

  if (titulo === "") {
    mensagem.textContent = "Precisas digitar uma tarefa";
    tituloDaTarefa.focus();
    return;
  }

  const tarefaJaExiste = tarefas.some(function (tarefa) {
    return tarefa.titulo.toLowerCase() === titulo.toLowerCase();
  });

  if (tarefaJaExiste) {
    mensagem.textContent = "Você já adicionou essa tarefa";
    tituloDaTarefa.focus();
    return;
  }

  const novaTarefa = {
    id: Date.now(),
    titulo: titulo,
    concluida: false
  };

  tarefas.push(novaTarefa);

  salvarTarefas();
  renderizarTarefas();

  mensagem.textContent = "";

  tituloDaTarefa.value = "";
  tituloDaTarefa.focus();
}
function renderizarTarefas() {
  listaDasTarefas.innerHTML = "";

  if (tarefas.length === 0) {
    const mensagemVazia = document.createElement("p");

    mensagemVazia.textContent = "Nenhuma tarefa foi dada";
    mensagemVazia.classList.add("vazia");

    listaDasTarefas.appendChild(mensagemVazia);

    return;
  }

  tarefas.forEach(function (tarefa) {
    const divDaTarefa = document.createElement("div");

    divDaTarefa.classList.add("tarefa");

    if (tarefa.concluida) {
      divDaTarefa.classList.add("concluida");
    }

    const divInfo = document.createElement("div");
    divInfo.classList.add("info-tarefa");

    const titulo = document.createElement("span");
    titulo.classList.add("titulo");

    titulo.textContent = tarefa.titulo;

    const status = document.createElement("span");
    status.classList.add("status");

    if (tarefa.concluida) {
      status.textContent = "Concluída";
    } else {
      status.textContent = "Pendente";
    }

    divInfo.appendChild(titulo);
    divInfo.appendChild(status);

    const divDasAcoes = document.createElement("div");
    divDasAcoes.classList.add("acoes");

    const btnConcluir = document.createElement("button");
    btnConcluir.classList.add("btn-concluir");

    if (tarefa.concluida) {
      btnConcluir.textContent = "Reabrir";
    } else {
      btnConcluir.textContent = "Concluir";
    }

    btnConcluir.addEventListener("click", function () {
      alternarStatusTarefa(tarefa.id);
    });

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("btn-excluir");

    btnExcluir.addEventListener("click", function () {
      excluirTarefa(tarefa.id);
    });

    divDasAcoes.appendChild(btnConcluir);
    divDasAcoes.appendChild(btnExcluir);

    divDaTarefa.appendChild(divInfo);
    divDaTarefa.appendChild(divDasAcoes);

    listaDasTarefas.appendChild(divDaTarefa);
  });
}

function alternarStatusTarefa(id) {
  const tarefa = tarefas.find(function (tarefa) {
    return tarefa.id === id;
  });

  if (tarefa) {
    tarefa.concluida = !tarefa.concluida;
  }

  salvarTarefas();
  renderizarTarefas();
}

function excluirTarefa(id) {
  tarefas = tarefas.filter(function (tarefa) {
    return tarefa.id !== id;
  });

  salvarTarefas();
  renderizarTarefas();
}

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  adicionarTarefa();
});

carregarTarefas();
renderizarTarefas();