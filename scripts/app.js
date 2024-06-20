
var tabelas = document.querySelectorAll('.products-list');
var tamanhoMain = document.getElementById('main').getBoundingClientRect().height;
var tamanhoButtonSection = document.getElementById('buttons-section').getBoundingClientRect().height;

tabelas.forEach((tabela) => {
    tabela.style.height = tamanhoMain - tamanhoButtonSection + 'px';
});