// Inicializa el fondo Vanta.js
VANTA.WAVES({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0xf59e0b,
    shininess: 35.00,
    waveHeight: 15.00,
    waveSpeed: 0.50,
    zoom: 0.75
});

// Funcionalidad del simulador de préstamo

document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    
    const amountSlider = document.getElementById('amount');
    const amountDisplay = document.getElementById('amount-display');
    const termSlider = document.getElementById('term');
    const termDisplay = document.getElementById('term-display');
    const monthlyPayment = document.getElementById('monthly-payment');
    const interestRate = document.getElementById('interest-rate');
    const totalPayment = document.getElementById('total-payment');
    
    function formatCurrency(value) {
        return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    function calculateCL() {
        const amount = parseInt(amountSlider.value);
        const term = parseInt(termSlider.value);
        
        // Cálculo de interés simple para demo
        const rate = 0.012; // 1.2% mensual
        const monthly = (amount * rate) / (1 - Math.pow(1 + rate, -term));
        const total = monthly * term;
        
        amountDisplay.value = formatCurrency(amount);
        termDisplay.value = term + ' meses';
        monthlyPayment.textContent = formatCurrency(Math.round(monthly));
        interestRate.textContent = (rate * 100).toFixed(1) + '% mensual';
        totalPayment.textContent = formatCurrency(Math.round(total));
    }
    
    amountSlider.addEventListener('input', calculateCL);
    termSlider.addEventListener('input', calculateCL);
    
    // Cálculo inicial
    calculateCL();
});
