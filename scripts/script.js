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

document.getElementById('produtoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;
    const tipo = document.getElementById('tipo').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const custo = parseFloat(document.getElementById('custo').value);
    const preco = parseFloat(document.getElementById('preco').value);

    if (codigo) {
        alterarProduto(parseInt(codigo), descricao, tipo, quantidade, custo, preco);
    } else {
        cadastrarProduto(descricao, tipo, quantidade, custo, preco);
    }
    limparFormulario();
    listarProdutos();
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
            <td>${produto.descricao}</td>
            <td>${produto.tipo}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.entradas}</td>
            <td>${produto.saidas}</td>
            <td>${produto.custo}</td>
            <td>${produto.preco}</td>
            <td>
                <button onclick="editarProduto(${produto.codigo})">Editar</button>
                <button onclick="removerProduto(${produto.codigo})">Remover</button>
            </td>
        `;
        tbody.appendChild(row);
    }
}

function editarProduto(codigo) {
    const produto = estoque[codigo];
    document.getElementById('codigo').value = produto.codigo;
    document.getElementById('descricao').value = produto.descricao;
    document.getElementById('tipo').value = produto.tipo;
    document.getElementById('quantidade').value = produto.quantidade;
    document.getElementById('custo').value = produto.custo;
    document.getElementById('preco').value = produto.preco;
}

function limparFormulario() {
    document.getElementById('codigo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('custo').value = '';
    document.getElementById('preco').value = '';
}

listarProdutos();
