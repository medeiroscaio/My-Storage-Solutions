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

    const estoque = {};

    document.getElementById('btnCadastrar').addEventListener('click', function() {
        const nome = prompt("Nome do Produto:");
        const tipo = prompt("Tipo do Produto:");
        const quantidade = parseInt(prompt("Quantidade do Produto:"));
        const custo = parseFloat(prompt("Custo do Produto:"));
        const preco = parseFloat(prompt("Preço do Produto:"));
        cadastrarProduto(nome, tipo, quantidade, custo, preco);
        listarProdutos();
        addRowListeners(); // Adiciona event listeners às novas linhas
    });

    document.getElementById('btnAlterar').addEventListener('click', function() {
        const codigo = parseInt(prompt("Código do Produto a ser alterado:"));
        const produto = estoque[codigo];
        if (produto) {
            const nome = prompt("Novo Nome do Produto:", produto.nome);
            const tipo = prompt("Novo Tipo do Produto:", produto.tipo);
            const quantidade = parseInt(prompt("Nova Quantidade do Produto:", produto.quantidade));
            const custo = parseFloat(prompt("Novo Custo do Produto:", produto.custo));
            const preco = parseFloat(prompt("Novo Preço do Produto:", produto.preco));
            alterarProduto(codigo, nome, tipo, quantidade, custo, preco);
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

    function cadastrarProduto(nome, tipo, quantidade, custo, preco) {
        const produto = new Produto(nome, tipo, quantidade, custo, preco);
        estoque[produto.codigo] = produto;
    }

    function alterarProduto(codigo, nome, tipo, quantidade, custo, preco) {
        const produto = estoque[codigo];
        if (produto) {
            produto.nome = nome;
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
                <td class="produto-codigo">${produto.codigo}</td>
                <td class="produto-nome"><p>${produto.nome}</p></td>
                <td class="produto-tipo">${produto.tipo}</td>
                <td class="warning">${produto.quantidade}</td>
                <td class="money">$${produto.custo}</td>
                <td class="money">$${produto.preco}</td>
            `;
            tbody.appendChild(row);
        }
    }


    /// FILTRO E BARRA DE PESQUISA ///

    let filtroSelecionado = 'codigo'; // Filtro padrão

    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function() {
            filtroSelecionado = this.getAttribute('data-filter');
            document.querySelector('.filtro.button span:first-child').textContent = this.textContent;
        });
    });

    document.querySelector('.search-button input').addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        filtrarProdutos(query);
    });

    function filtrarProdutos(query) {
        const tbody = document.querySelector('#produtosTable tbody');
        tbody.innerHTML = '';
        for (const codigo in estoque) {
            const produto = estoque[codigo];
            let match = false;
            if (filtroSelecionado === 'codigo' && produto.codigo.toString().includes(query)) {
                match = true;
            } else if (filtroSelecionado === 'nome' && produto.nome.toLowerCase().includes(query)) {
                match = true;
            } else if (filtroSelecionado === 'tipo' && produto.tipo.toLowerCase().includes(query)) {
                match = true;
            }
            if (match) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="produto-codigo">${produto.codigo}</td>
                    <td class="produto-nome"><p>${produto.nome}</p></td>
                    <td class="produto-tipo">${produto.tipo}</td>
                    <td class="warning">${produto.quantidade}</td>
                    <td class="money">$${produto.custo}</td>
                    <td class="money">$${produto.preco}</td>
                `;
                tbody.appendChild(row);
            }
        }
    }

    /// FILTRO E BARRA DE PESQUISA END ///

    addRowListeners(); // Inicializa event listeners para as linhas existentes (se houver)
    listarProdutos();
});
