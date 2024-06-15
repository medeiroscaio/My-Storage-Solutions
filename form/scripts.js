document.addEventListener('DOMContentLoaded', () => {
    const openPopupBtn = document.getElementById('openPopupBtn');
    const popup = document.getElementById('popup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupContent = document.querySelector('.popup-content');
    const successPopup = document.querySelector('.message');

    // Ocultar o popup de confirmação inicialmente
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
        // Fechar o popup principal com fadeOut
        popupContent.classList.add('closing');
        setTimeout(() => {
            popup.style.display = 'none';
            popupContent.classList.remove('closing');
        }, 300);

        // Mostrar o popup de confirmação após 1 segundo
        setTimeout(() => {
            successPopup.style.opacity = '1';
            successPopup.style.top = '50%';
        }, 1000);
    });

    const okButton = document.getElementById('ok');
    okButton.addEventListener('click', () => {
        // Adicionar classe para fadeOut ao popup de confirmação
        successPopup.classList.add('closing');
        setTimeout(() => {
            successPopup.style.opacity = '0';
            successPopup.style.top = '-200px';
            successPopup.classList.remove('closing');
        }, 300); // Tempo de fadeOut
    });

    function closePopup() {
        popupContent.classList.add('closing');
        setTimeout(() => {
            popup.style.display = 'none';
            popupContent.classList.remove('closing');
        }, 300);
    }
});
