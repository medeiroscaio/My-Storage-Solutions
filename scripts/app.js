document.addEventListener('DOMContentLoaded', (event) => {
    const rows = document.querySelectorAll('.table-body tr');
    
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (row.classList.contains('selected')) {
                row.classList.remove('selected');
            } else {
                rows.forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
            }
        });
    });
});