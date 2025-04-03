document.querySelector('.login-form form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const button = document.querySelector('.signup-button');
    const buttonText = button.querySelector('.button-text');
    const spinner = button.querySelector('.loading-spinner');
    const formData = new FormData(e.target);

    // Validación de contraseñas
    if (formData.get('password') !== formData.get('confirmPassword')) {
        alert('⚠️ Las contraseñas no coinciden');
        return;
    }

    // Deshabilita el botón y muestra spinner
    button.disabled = true;
    buttonText.textContent = 'Registrando...';
    spinner.hidden = false;

    try {
        const response = await fetch('../backend/registrar.php', {
            method: 'POST',
            body: formData
        });

        // Manejo de respuesta del servidor
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            const result = await response.text();
            alert(result.includes('Error') ? result : 'Registro exitoso');
        }
    } catch (error) {
        alert('Error de conexión: ' + error.message);
    } finally {
        // Restaura el botón
        button.disabled = false;
        buttonText.textContent = 'REGISTRARSE';
        spinner.hidden = true;
    }
});

// Validación en tiempo real de contraseña
document.getElementById('confirmPassword').addEventListener('input', (e) => {
    const pass = document.getElementById('password').value;
    const confirmPass = e.target.value;
    
    if (pass !== confirmPass && confirmPass !== '') {
        e.target.setCustomValidity('Las contraseñas no coinciden');
    } else {
        e.target.setCustomValidity('');
    }
});