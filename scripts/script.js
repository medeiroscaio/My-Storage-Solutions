document.addEventListener('DOMContentLoaded', (event) => {
    const buttons = document.querySelectorAll('.buttons-section button');

    function addRowListeners() {
        const rows = document.querySelectorAll('.table-body tr');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                if (row.classList.contains('selected')) {
                    row.classList.remove('selected');
                    // Remove a classe de estilo dos botões se a linha for desselecionada
                    buttons.forEach(button => button.classList.remove('selected-row'));
                } else {
                    rows.forEach(r => r.classList.remove('selected'));
                    row.classList.add('selected');
                    // Adiciona a classe de estilo aos botões quando uma linha é selecionada
                    buttons.forEach(button => button.classList.add('selected-row'));
                }
            });
        });
    }

    class Produto {
        static codigoAutoIncrement = 1;
        constructor(descricao, tipo, quantidade, custo, preco) {
            this.codigo = Produto.codigoAutoIncrement++;
            this.descricao = descricao;
            this.tipo = tipo;
            this.quantidade = quantidade;
            this.entradas = 0;
            this.saidas = 0;
            this.custo = custo;
            this.preco = preco;
        }
    }

    const estoque = {};

    document.getElementById('btnCadastrar').addEventListener('click', function() {
        const descricao = prompt("Descrição do Produto:");
        const tipo = prompt("Tipo do Produto:");
        const quantidade = parseInt(prompt("Quantidade do Produto:"));
        const custo = parseFloat(prompt("Custo do Produto:"));
        const preco = parseFloat(prompt("Preço do Produto:"));
        cadastrarProduto(descricao, tipo, quantidade, custo, preco);
        listarProdutos();
        addRowListeners(); // Adiciona event listeners às novas linhas
    });

    document.getElementById('btnAlterar').addEventListener('click', function() {
        const codigo = parseInt(prompt("Código do Produto a ser alterado:"));
        const produto = estoque[codigo];
        if (produto) {
            const descricao = prompt("Nova Descrição do Produto:", produto.descricao);
            const tipo = prompt("Novo Tipo do Produto:", produto.tipo);
            const quantidade = parseInt(prompt("Nova Quantidade do Produto:", produto.quantidade));
            const custo = parseFloat(prompt("Novo Custo do Produto:", produto.custo));
            const preco = parseFloat(prompt("Novo Preço do Produto:", produto.preco));
            alterarProduto(codigo, descricao, tipo, quantidade, custo, preco);
            listarProdutos();
            addRowListeners(); // Adiciona event listeners às novas linhas
        } else {
            alert("Produto não encontrado!");
        }
    });

    document.getElementById('btnRemover').addEventListener('click', function() {
        const codigo = parseInt(prompt("Código do Produto a ser removido:"));
        removerProduto(codigo);
        addRowListeners(); // Atualiza event listeners após remover linha
    });

    function cadastrarProduto(descricao, tipo, quantidade, custo, preco) {
        const produto = new Produto(descricao, tipo, quantidade, custo, preco);
        estoque[produto.codigo] = produto;
    }

    function alterarProduto(codigo, descricao, tipo, quantidade, custo, preco) {
        const produto = estoque[codigo];
        if (produto) {
            produto.descricao = descricao;
            produto.tipo = tipo;
            produto.quantidade = quantidade;
            produto.custo = custo;
            produto.preco = preco;
        }
    }

    function removerProduto(codigo) {
        delete estoque[codigo];
        listarProdutos();
    }

    function listarProdutos() {
        const tbody = document.querySelector('#produtosTable tbody');
        tbody.innerHTML = '';
        for (const codigo in estoque) {
            const produto = estoque[codigo];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${produto.codigo}</td>
                <td><p>${produto.descricao}</p></td>
                <td>${produto.tipo}</td>
                <td class="warning">${produto.quantidade}</td>
                <td>${produto.entradas}</td>
                <td>${produto.saidas}</td>
                <td class="money">$${produto.custo}</td>
                <td class="money">$${produto.preco}</td>
            `;
            tbody.appendChild(row);
        }
    }

    addRowListeners(); // Inicializa event listeners para as linhas existentes (se houver)
    listarProdutos();
});