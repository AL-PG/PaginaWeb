document.addEventListener('DOMContentLoaded', function() {
    const userIcon = document.getElementById('userIcon');
    const userDropdown = document.getElementById('userDropdown');
    
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
});