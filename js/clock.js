function updateClock() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);

    const clockElement = document.querySelector('.clock h1');
    const dateElement = document.querySelector('.clock span');

    if (clockElement) clockElement.textContent = `${hours}:${minutes}`;
    if (dateElement) dateElement.textContent = `${day}.${month}.${year}`;
}

setInterval(updateClock, 1000);
updateClock();

