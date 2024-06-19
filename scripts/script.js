const notificationIcon = document.getElementById("notification-icon");
const notificationPopup = document.getElementById("notification-popup");
const notificationCountElement =
  document.getElementById("notification-count");
const notificationList = document.getElementById("notification-list");
const noNotificationsElement = document.getElementById("no-notifications");
const lowStockLimit = 5;
let notificationCount = 0;

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

function limparFormulario() {
  document.getElementById('nome').value = '';
  document.getElementById('tipo').value = '';
  document.getElementById('quantidade').value = '';
  document.getElementById('custo').value = '';
  document.getElementById('preco').value = '';
}

const estoque = {};
const notifications = [];
const productStates = {};

function cadastrarProduto(nome, tipo, quantidade, custo, preco) {
  const produto = new Produto(nome, tipo, quantidade, custo, preco);
  estoque[produto.codigo] = produto;
  productStates[produto.codigo] = "normal";
  listarProdutos();
  addRowListeners();
  limparFormulario();
}

function addRowListeners() {
  const rows = document.querySelectorAll(".table-body tr");
  const buttons = document.querySelectorAll(".buttons-section .button");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      if (row.classList.contains("selected")) {
        row.classList.remove("selected");
        buttons.forEach((button) => button.classList.remove("selected-row"));
      } else {
        rows.forEach((r) => r.classList.remove("selected"));
        row.classList.add("selected");
        buttons.forEach((button) => button.classList.add("selected-row"));
      }
    });
  });
}

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
}

document.addEventListener("DOMContentLoaded", (event) => {

  document.getElementById("btnAlterar").addEventListener("click", function () {
    const codigo = parseInt(prompt("Código do Produto a ser alterado:"));
    const produto = estoque[codigo];
    if (produto) {
      const nome = prompt("Novo Nome do Produto:", produto.nome);
      const tipo = prompt("Novo Tipo do Produto:", produto.tipo);
      const quantidade = parseInt(
        prompt("Nova Quantidade do Produto:", produto.quantidade)
      );
      const custo = parseFloat(prompt("Novo Custo do Produto:", produto.custo));
      const preco = parseFloat(prompt("Novo Preço do Produto:", produto.preco));
      alterarProduto(codigo, nome, tipo, quantidade, custo, preco);
      listarProdutos();
      addRowListeners();
    } else {
      alert("Produto não encontrado!");
    }
  });

  document.getElementById("btnRemover").addEventListener("click", function () {
    const codigo = parseInt(prompt("Código do Produto a ser removido:"));
    removerProduto(codigo);
    listarProdutos();
    addRowListeners();
  });

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
  }

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
  }

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
    });

  function removerProduto(codigo) {
    delete estoque[codigo];
    delete productStates[codigo];
    listarProdutos();
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

  addRowListeners();
  listarProdutos();
});

export {cadastrarProduto};
