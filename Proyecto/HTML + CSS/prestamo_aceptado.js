document.addEventListener('DOMContentLoaded', function() {
    feather.replace();

    // Set due date (30 days from now)
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('due-date').textContent = dueDate.toLocaleDateString('es-ES', options);

    // Form submission
    document.getElementById('bank-account-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Datos recibidos correctamente! El dinero será transferido en los próximos 10 minutos.');
        // Here you would typically send the form data to your backend
    });
});