document.addEventListener('DOMContentLoaded', (event) => {
    const rows = document.querySelectorAll('.table-body tr');
    const buttons = document.querySelectorAll('.buttons-section button');

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
});