import { cadastrarProduto, alterarProduto, removerProduto, estoque } from './script.js';

document.addEventListener('DOMContentLoaded', () => {
    const openPopupBtn = document.getElementById('btnCadastrar');
    const popup = document.getElementById('popup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupContent = document.querySelector('.popup-content');
    const successPopup = document.getElementById('successMessage');
    const popupMessage = document.getElementById('popup-message');
    const submitButton = document.getElementById('submitbutton');
    const okButton = document.getElementById('ok');
    const btnAlterar = document.getElementById('btnAlterar');
    const confirmPopup = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    let isEditing = false;
    let editingProductCode = null;

    successPopup.style.opacity = '0';
    successPopup.style.top = '-200px';

    openPopupBtn.addEventListener('click', () => {
        isEditing = false;
        submitButton.innerHTML = 'Cadastrar Produto'; 
        openPopup();
    });

    btnAlterar.addEventListener('click', () => {
        const selectedRow = document.querySelector('.table-body tr.selected');
        if (selectedRow) {
            const codigo = parseInt(selectedRow.querySelector('.produto-codigo').textContent.trim());
            const produto = estoque[codigo];
            if (produto) {
                form.nome.value = produto.nome;
                form.tipo.value = produto.tipo;
                form.quantidade.value = produto.quantidade;
                form.custo.value = produto.custo;
                form.preco.value = produto.preco;

                isEditing = true;
                editingProductCode = codigo;
                submitButton.innerHTML = 'Alterar Produto'; 
                openPopup();
            }
        }
    });

    document.getElementById("btnRemover").addEventListener("click", function () {
        const selectedRow = document.querySelector(".table-body tr.selected");
        if (selectedRow) {
            setTimeout(() => {
                confirmPopup.style.display = 'flex';
                confirmPopup.style.opacity = '1';
                confirmPopup.style.top = '50%';
            }, 200);
            const codigo = parseInt(selectedRow.querySelector('.produto-codigo').textContent.trim());
            confirmBtn.onclick = function () {
                removerProduto(codigo);
                confirmPopup.style.display = 'none';
                confirmPopup.style.opacity = '0';
                confirmPopup.style.top = '-200px';
                addRowListeners();
            };

            cancelBtn.onclick = function () {
                confirmPopup.style.display = 'none';
                confirmPopup.style.opacity = '0';
                confirmPopup.style.top = '-200px';
            };
        }
    });

    closePopupBtn.addEventListener('click', () => {
        closePopup();
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    });

    const form = document.getElementById('productForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = form.nome.value;
        const tipo = form.tipo.value;
        const quantidade = parseInt(form.quantidade.value);
        const custo = parseFloat(form.custo.value);
        const preco = parseFloat(form.preco.value);

        if (isEditing && editingProductCode !== null) {
            alterarProduto(editingProductCode, nome, tipo, quantidade, custo, preco);
            popupMessage.innerHTML = 'Produto foi alterado com sucesso!';
            isEditing = false;
            editingProductCode = null;
        } else {
            cadastrarProduto(nome, tipo, quantidade, custo, preco);
            popupMessage.innerHTML = 'Produto foi cadastrado com sucesso!';
        }

        popupContent.classList.add('closing');
        setTimeout(() => {
            popup.style.display = 'none';
            popupContent.classList.remove('closing');
        }, 200);
        setTimeout(() => {
            successPopup.style.opacity = '1';
            successPopup.style.top = '50%';
        }, 200);
    });

    okButton.addEventListener('click', () => {
        successPopup.classList.add('closing');
        successPopup.style.opacity = '0';
        successPopup.style.top = '-200px';
        successPopup.classList.remove('closing');
    });

    function closePopup() {
        popupContent.classList.add('closing');
        popup.style.display = 'none';
        popupContent.classList.remove('closing');
        form.reset();
        isEditing = false;
        editingProductCode = null;
    }

    function openPopup() {
        popup.style.display = 'flex';
        popupContent.classList.remove('closing');
    }
});
