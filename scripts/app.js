
var tabela = document.getElementById('products-list');
var tamanhoMain = document.getElementById('main').getBoundingClientRect().height;
var tamanhoButtonSection = document.getElementById('buttons-section').getBoundingClientRect().height;

tabela.style.height = tamanhoMain - tamanhoButtonSection + 'px';

