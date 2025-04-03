document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        // Validación básica
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            e.preventDefault();
            alert('⚠️ Todos los campos son obligatorios');
            return;
        }

        // Validación de formato de email
        if (!/\S+@\S+\.\S+/.test(email)) {
            e.preventDefault();
            alert('⚠️ Formato de email inválido');
            return;
        }
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const button = document.querySelector('.login-button');
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.loading-spinner');

    // Deshabilita el botón durante la solicitud
    button.disabled = true;
    buttonText.textContent = 'Cargando...';
    spinner.hidden = false;

    try {
        const response = await fetch('../backend/auth.php', {
            method: 'POST',
            body: new FormData(form)
        });

        if (response.redirected) {
            window.location.href = response.url;
        } else {
            const result = await response.text();
            alert(`Error: ${result}`);
        }
    } catch (error) {
        alert('Error de conexión');
    } finally {
        button.disabled = false;
        buttonText.textContent = 'INICIAR SESIÓN';
        spinner.hidden = true;
    }
});