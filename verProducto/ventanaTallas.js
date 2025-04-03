document.addEventListener("DOMContentLoaded", function() {
    const sizeGuideLink = document.querySelector('.size-guide-link');
    const sizeGuideModal = document.getElementById('sizeGuideModal');
    const closeModal = document.querySelector('.close-modal');

    if (sizeGuideLink) {
        sizeGuideLink.addEventListener('click', function(e) {
            e.preventDefault();
            sizeGuideModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            sizeGuideModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === sizeGuideModal) {
            sizeGuideModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});