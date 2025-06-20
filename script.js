// Script para interatividade futura
console.log("Radar Urbano Inteligente - Script carregado.");

// Exemplo de funcionalidade futura: menu ativo ao rolar a página
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('main section');
    const navLi = document.querySelectorAll('.main-nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Adjust offset for sticky header height
            if (pageYOffset >= sectionTop - 150) { 
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            // Remove active style from all
            a.style.fontWeight = '400';
            a.classList.remove('active'); // Use a class for better styling

            // Add active style to the current section's link
            if (a.getAttribute('href') === `#${current}`) {
                a.style.fontWeight = '600';
                a.classList.add('active'); // Add a class for better styling
            }
        });
    });

    // New: Handle Bot Cidadão card click to show overlay
    const botCidadaoCard = document.getElementById('bot-cidadao-card');
    const botDetailsOverlay = document.getElementById('bot-details-overlay');
    const closeButton = document.querySelector('#bot-details-overlay .close-button');

    if (botCidadaoCard && botDetailsOverlay && closeButton) {
        botCidadaoCard.style.cursor = 'pointer'; // Indicate it's clickable
        botCidadaoCard.addEventListener('click', () => {
            botDetailsOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling of the background
        });

        closeButton.addEventListener('click', () => {
            botDetailsOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
});