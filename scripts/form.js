import { cadastrarProduto} from './script.js';

document.addEventListener('DOMContentLoaded', () => {
    const openPopupBtn = document.getElementById('btnCadastrar');
    const popup = document.getElementById('popup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupContent = document.querySelector('.popup-content');
    const successPopup = document.getElementById('successMessage');
    const okButton = document.getElementById('ok');

    successPopup.style.opacity = '0';
    successPopup.style.top = '-200px';

    openPopupBtn.addEventListener('click', () => {
        popup.style.display = 'flex';
        popupContent.classList.remove('closing');
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

        cadastrarProduto(nome, tipo, quantidade, custo, preco);
        
        popupContent.classList.add('closing');
        setTimeout(() => {
            popup.style.display = 'none';
            popupContent.classList.remove('closing');
        }, 300);
        setTimeout(() => {
            successPopup.style.opacity = '1';
            successPopup.style.top = '50%';
        }, 1000);
    });

    okButton.addEventListener('click', () => {
        successPopup.classList.add('closing');
        setTimeout(() => {
            successPopup.style.opacity = '0';
            successPopup.style.top = '-200px';
            successPopup.classList.remove('closing');
        }, 300);
    });

    function closePopup() {
        popupContent.classList.add('closing');
        setTimeout(() => {
            popup.style.display = 'none';
            popupContent.classList.remove('closing');
        }, 300);
    }
    
});
