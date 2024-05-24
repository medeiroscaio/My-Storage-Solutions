var esquerda = document.getElementById('esquerda');
var tamanhoCard = document.getElementById('card').getBoundingClientRect().height;

esquerda.style.height = tamanhoCard + 'px';

/*
O método getBoundingClientRect().height;
serve para obter a ALTURA EXATA de um elemento.
Ou seja a altura com números decimais EX: 575.55

tem outro método mas ele só obtém a altura arredondada para inteiro,
fazendo com que o tamanho não fique igual.

Em call explico pq fiz isso.
*/