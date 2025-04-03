const buttons = document.querySelectorAll("[data-carousel-button]");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        console.log("si funciona");
        const offset = button.dataset.carouselButton === "next" ? -1 : 1
        const slides = button
            .closest("[data-carousel]")
            .querySelector("[data-slides]")

        const activeSlide = slides.querySelector("[data-active]")
        let newIndex = [...slides.children].indexOf(activeSlide) + offset
        if(newIndex < 0) newIndex = slides.children.length - 1
        if(newIndex >= slides.children.length) newIndex = 0

        slides.children[newIndex].dataset.active = true
        delete activeSlide.dataset.active
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    // Mostrar/ocultar menú al hacer clic en el ícono
    userIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', function() {
        userDropdown.classList.remove('show');
    });

    // Evitar que el menú se cierre al hacer clic dentro de él
    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Cerrar sesión
    logoutBtn?.addEventListener('click', function() {
        fetch('../backend/logout.php', {
            method: 'POST',
            credentials: 'same-origin'
        }).then(() => {
            // Redirigir a la página de inicio o refrescar
            window.location.href = '../main/index.php';
        });
    });
});