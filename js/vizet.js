const vizetMenu = document.querySelector('.vizet');

document.addEventListener('mousemove', (e) => {
    const threshold = 10;
    if (window.innerWidth - e.clientX < threshold) {
        vizetMenu.classList.add('is-visible');
    } else if (e.clientX < (window.innerWidth - vizetMenu.offsetWidth)) {
        vizetMenu.classList.remove('is-visible');
    }
});