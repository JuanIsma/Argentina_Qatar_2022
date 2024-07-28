//ABRIR VENTANA POP UP DE CONTACTO 
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('contactLink').addEventListener('click', function(event) {
        event.preventDefault();  // Evita que el enlace realice la acción por defecto
        openPopup();
    });
});

function openPopup() {
    const popupWidth = 800;
    const popupHeight = 600;
    const left = (screen.width / 2) - (popupWidth / 2);
    const top = (screen.height / 2) - (popupHeight / 2);
    window.open(
        'contacto.html', 
        'popup', 
        `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
    );
}
