// Definição de elementos
const notificationIcon = document.getElementById("notification-icon");
const notificationPopup = document.getElementById("notification-popup");
const notificationCountElement = document.getElementById("notification-count");
const notificationList = document.getElementById("notification-list");
const noNotificationsElement = document.getElementById("no-notifications");
const lowStockLimit = 5;
let notificationCount = 0;
let totalProduto = 0;
let produtosAtivos = 0;
let produtosRemovidos = 0;

// Variáveis Globais
let filtroSelecionado = "codigo"; // Define um filtro padrão

notificationIcon.addEventListener("click", (event) => {
  event.stopPropagation();
  if (notificationPopup.classList.contains("hidden")) {
    notificationPopup.classList.remove("hidden");
    displayNotifications();
    notificationCount = 0;
    notificationCountElement.textContent = notificationCount;
  } else {
    notificationPopup.classList.add("hidden");
  }
});

document.addEventListener("click", (event) => {
  if (!notificationPopup.classList.contains("hidden")) {
    notificationPopup.classList.add("hidden");
  }
});

function addNotification(message, productId, state) {
  const timestamp = new Date().toISOString();
  const notification = {
    message,
    productId,
    state,
    timestamp,
  };
  notifications.unshift(notification);
  notificationCount++;
  notificationCountElement.textContent = notificationCount;
  productStates[productId] = state;
}

function displayNotifications() {
  notificationList.innerHTML = "";
  if (notifications.length === 0) {
    noNotificationsElement.classList.remove("hidden");
  } else {
    noNotificationsElement.classList.add("hidden");
    notifications.forEach((notification) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = notification.message;
      notificationList.appendChild(listItem);
    });
  }
}

class Produto {
  static codigoAutoIncrement = 1;
  constructor(nome, tipo, quantidade, custo, preco) {
    this.codigo = Produto.codigoAutoIncrement++;
    this.nome = nome;
    this.tipo = tipo;
    this.quantidade = quantidade;
    this.entradas = 0;
    this.saidas = 0;
    this.custo = custo;
    this.preco = preco;
  }
}

class Relatorio {
  #d;
  constructor(produto, destino) {
    this.produto = produto;
    this.destino = destino;
    this.#d = new Date();
    this.data = `${this.#d.getDate().toString().padStart(2, "0")}/${(
      this.#d.getMonth() + 1
    )
      .toString()
      .padStart(
        2,
        "0"
      )}/${this.#d.getFullYear()} ${this.#d.getHours()}:${this.#d.getMinutes()}`;
  }
}

function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("custo").value = "";
  document.getElementById("preco").value = "";
}

const estoque = [];
const listRelatorio = [];
const notifications = [];
const productStates = {};

function listarTodos() {
  listarProdutos();
  listarDashboard();
  listarRelatorio();
}

function cadastrarProduto(nome, tipo, quantidade, custo, preco) {
  const produto = new Produto(nome, tipo, quantidade, custo, preco);
  estoque[produto.codigo] = produto;
  productStates[produto.codigo] = "normal";
  totalProduto += 1;
  produtosAtivos += 1;
  cadastrarRelatorio(produto, "CADASTRADO");
  listarTodos();
  addRowListeners();
  limparFormulario();
}

function alterarProduto(codigo, nome, tipo, quantidade, custo, preco) {
  const produto = estoque[codigo];
  if (produto) {
    const wasLowStock = produto.quantidade <= lowStockLimit;
    produto.nome = nome;
    produto.tipo = tipo;
    produto.quantidade = quantidade;

    if (wasLowStock && produto.quantidade > lowStockLimit) {
      const notification = `<p><i class="fa-solid fa-check-circle success"></i> Produto ${produto.codigo} teve seu estoque corrigido para ${produto.quantidade} unidades!</p>`;
      if (productStates[produto.codigo] !== "normal") {
        addNotification(notification, produto.codigo, "normal");
      }
    } else if (produto.quantidade <= lowStockLimit) {
      const notification = `<p><i class="fa-solid fa-triangle-exclamation warning"></i> Produto ${produto.codigo} está com estoque baixo!</p>`;
      if (productStates[produto.codigo] !== "lowStock") {
        addNotification(notification, produto.codigo, "lowStock");
      }
    } else {
      productStates[produto.codigo] = "normal";
    }

    produto.custo = custo;
    produto.preco = preco;
  }
  listarTodos();
  addRowListeners();
}

//CADASTRAR RELATORIO
let posicao = 0;
function cadastrarRelatorio(produto, destino) {
  const relatorio = new Relatorio(produto, destino);
  listRelatorio[posicao] = relatorio;
  posicao += 1;
} //CADASTRAR RELATORIO

function addRowListeners() {
  const rows = document.querySelectorAll(".table-body tr");
  const buttons = document.querySelectorAll(".buttons-section .button");
  const btnAlterar = document.getElementById("btnAlterar");
  const btnRemover = document.getElementById("btnRemover");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      if (row.classList.contains("selected")) {
        row.classList.remove("selected");
        buttons.forEach((button) => button.classList.remove("selected-row"));
        btnAlterar.disabled = true;
        btnRemover.disabled = true;
      } else {
        rows.forEach((r) => r.classList.remove("selected"));
        row.classList.add("selected");
        buttons.forEach((button) => button.classList.add("selected-row"));
        btnAlterar.disabled = false;
        btnRemover.disabled = false;
      }
    });
  });
  btnAlterar.disabled = true;
  btnRemover.disabled = true;
}

/// LISTAR PRODUTOS ///
document.getElementById("tabela").addEventListener("click", function () {
  document.getElementById("products-list").style.display = "block";
  document.getElementById("dashboard-painel").style.display = "none";
  document.getElementById("relatorio-list").style.display = "none";
  this.classList.add("active");
  document.getElementById("dashboard").classList.remove("active");
  document.getElementById("relatorio").classList.remove("active");
});
function listarProdutos() {
  const tbody = document.querySelector("#produtosTable tbody");
  tbody.innerHTML = "";
  for (const codigo in estoque) {
    const produto = estoque[codigo];
    const row = document.createElement("tr");
    row.className =
      produto.quantidade <= lowStockLimit ? "low-stock" : "in-stock";
    row.innerHTML = `
        <td class="produto-codigo"><div class="barra"></div>${
          produto.codigo
        }</td>
        <td class="produto-nome"><p>${produto.nome}</p></td>
        <td class="produto-tipo"><p>${produto.tipo}</p></td>
        <td class="stock-status">${produto.quantidade}</td>
        <td class="money">$${produto.custo.toFixed(2)}</td>
        <td class="money">${produto.preco.toFixed(2)}</td>
      `;
    tbody.appendChild(row);

    if (produto.quantidade <= lowStockLimit) {
      const notification = `<p><i class="fa-solid fa-triangle-exclamation warning"></i> Produto ${produto.codigo} está com estoque baixo!</p>`;
      if (productStates[produto.codigo] !== "lowStock") {
        addNotification(notification, produto.codigo, "lowStock");
      }
    } else {
      productStates[produto.codigo] = "normal";
    }
  }
} /// LISTAR PRODUTOS ///

/// FUNÇÕES DASHBOARD ///
document.getElementById("dashboard").addEventListener("click", function () {
  listarDashboard();
  document.getElementById("products-list").style.display = "none";
  document.getElementById("dashboard-painel").style.display = "block";
  document.getElementById("relatorio-list").style.display = "none";
  document.getElementById("tabela").classList.remove("active");
  this.classList.add("active");
  document.getElementById("relatorio").classList.remove("active");
});
/// LISTAR DASHBOARD ///
function listarDashboard() {
  let totalEstoque = 0;
  let porcentagemAtiva = 0;
  let porcentagemRemovida = 0;
  estoque.forEach((produto) => {
    if (isNaN(produto.quantidade)) {
    } else {
      totalEstoque += produto.quantidade;
    }
  });

  document.querySelector(".quantidade-total-estoque h1 span").innerHTML =
    totalEstoque;
  document.querySelector(".produtos-cadastrados .cor-de-fundo h2").innerHTML =
    totalProduto;
  document.querySelector(".produtos-ativos .cor-de-fundo h2").innerHTML =
    produtosAtivos;
  document.querySelector(".produtos-removidos .cor-de-fundo h2").innerHTML =
    produtosRemovidos;

  porcentagemAtiva = ((produtosAtivos * 100) / totalProduto).toFixed(0);
  porcentagemRemovida = ((produtosRemovidos * 100) / totalProduto).toFixed(0);

  if (isNaN(porcentagemAtiva) && isNaN(porcentagemRemovida)) {
  } else if (isNaN(porcentagemRemovida)) {
    document.querySelector(".produtos-ativos h1").innerHTML =
      porcentagemAtiva + "%";
  } else if (isNaN(porcentagemAtiva)) {
    document.querySelector(".produtos-removidos h1").innerHTML =
      porcentagemRemovida + "%";
  } else {
    document.querySelector(".produtos-ativos h1").innerHTML =
      porcentagemAtiva + "%";
    document.querySelector(".produtos-removidos h1").innerHTML =
      porcentagemRemovida + "%";
  }

  document.querySelector(".produtos-ativos .cor-de-fundo").style.width =
    porcentagemAtiva + "%";
  document.querySelector(".produtos-removidos .cor-de-fundo").style.width =
    porcentagemRemovida + "%";
} /// FUNÇÕES DASHBOARD ///

/// LISTAR TABELA DE RELATORIO ///
document.getElementById("relatorio").addEventListener("click", function () {
  document.getElementById("products-list").style.display = "none";
  document.getElementById("dashboard-painel").style.display = "none";
  document.getElementById("relatorio-list").style.display = "block";
  document.getElementById("tabela").classList.remove("active");
  document.getElementById("dashboard").classList.remove("active");
  this.classList.add("active");
});

function listarRelatorio() {
  const tbody = document.querySelector("#relatorio-table tbody");
  tbody.innerHTML = "";

  listRelatorio.forEach((relatorio) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                <td class="produto-codigo">${relatorio.produto.codigo}</td>
                <td class="produto-nome"><p>${relatorio.produto.nome}</p></td>
                <td class="produto-tipo">${relatorio.produto.tipo}</td>
                <td class="warning destino">${relatorio.destino}</td>
                <td class="money">${relatorio.data}</td>
            `;
    tbody.appendChild(row);
    document.querySelectorAll(".destino").forEach(function (valor) {
      if (valor.textContent.trim() == "CADASTRADO") {
        valor.style.color = "#78bf9c";
      }
      if (valor.textContent.trim() == "REMOVIDO") {
        valor.style.color = "#e2a576";
      }
    });
  });
} // LISTAR TABELA DE RELATORIO

document.querySelectorAll(".filter-option").forEach((option) => {
  option.addEventListener("click", function () {
    filtroSelecionado = this.getAttribute("data-filter");
    document.querySelector(".filtro.button span:first-child").textContent =
      this.textContent;
  });
});

document
  .querySelector(".search-button input")
  .addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    filtrarProdutos(query);
    addRowListeners();
  });

function removerProduto(codigo) {
  if (estoque[codigo] != null) {
    cadastrarRelatorio(estoque[codigo], "REMOVIDO");
    delete estoque[codigo];
    delete productStates[codigo];
    produtosAtivos -= 1;
    produtosRemovidos += 1;
    listarTodos();
    addRowListeners();
  }
}

function filtrarProdutos(query) {
  const tbody = document.querySelector("#produtosTable tbody");
  tbody.innerHTML = "";
  for (const codigo in estoque) {
    const produto = estoque[codigo];
    let match = false;
    if (
      filtroSelecionado === "codigo" &&
      produto.codigo.toString().includes(query)
    ) {
      match = true;
    } else if (
      filtroSelecionado === "nome" &&
      produto.nome.toLowerCase().includes(query)
    ) {
      match = true;
    } else if (
      filtroSelecionado === "tipo" &&
      produto.tipo.toLowerCase().includes(query)
    ) {
      match = true;
    }
    if (match) {
      const row = document.createElement("tr");
      row.className =
        produto.quantidade <= lowStockLimit ? "low-stock" : "in-stock";
      row.innerHTML = `
          <td class="produto-codigo"><div class="barra"></div>${
            produto.codigo
          }</td>
          <td class="produto-nome"><p>${produto.nome}</p></td>
          <td class="produto-tipo"><p>${produto.tipo}</p></td>
          <td class="stock-status">${produto.quantidade}</td>
          <td class="money">${produto.custo.toFixed(2)}</td>
          <td class="money">${produto.preco.toFixed(2)}</td>
        `;
      tbody.appendChild(row);
    }
  }
}

document.addEventListener("DOMContentLoaded", (event) => {

  addRowListeners();
  listarTodos();
});

export { cadastrarProduto, alterarProduto, removerProduto, estoque};
