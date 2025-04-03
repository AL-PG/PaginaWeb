// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Selector de tallas
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección previa
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Seleccionar talla clickeada
            this.classList.add('selected');
            
            // Opcional: Guardar selección para enviar con el formulario
            const selectedSize = this.textContent.trim();
            console.log('Talla seleccionada:', selectedSize);
        });
    });

    // Selector de cantidad (si lo mantienes)
    const minusBtn = document.querySelector('.quantity-minus');
    const plusBtn = document.querySelector('.quantity-plus');
    const quantityInput = document.querySelector('.quantity-selector input');
    
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.querySelector('.main-image img'); // Corregido el selector
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Obtener la imagen de alta resolución del atributo data-full
            const fullSizeImage = this.getAttribute('data-full');
            
            // Cambiar la imagen principal
            mainImage.src = fullSizeImage;
            mainImage.alt = this.alt;
            
            // Remover clase activa de todas las miniaturas
            thumbnails.forEach(thumb => thumb.classList.remove('active-thumbnail'));
            // Añadir clase activa a la miniatura clickeada
            this.classList.add('active-thumbnail');
        
        });
    });
});

// Acordeón de composición y cuidado
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const accordion = header.parentElement;
        accordion.classList.toggle('accordion-open');
    });
});

// Función para los corazones de favoritos
document.querySelectorAll('.heart-icon').forEach(heart => {
    heart.addEventListener('click', function(e) {
        e.stopPropagation(); // Evita que el click afecte al producto
        this.innerHTML = this.classList.contains('favorited') ? 
            '<i class="far fa-heart"></i>' : 
            '<i class="fas fa-heart"></i>';
        this.classList.toggle('favorited');
    });
});

document.querySelector('.wishlist-icon').addEventListener('click', function() {
    this.classList.toggle('favorited');
    this.classList.toggle('far');
    this.classList.toggle('fas');
});

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