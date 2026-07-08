const status = document.getElementById('boot-status');
const bootScreen = document.getElementById('boot-screen');

const phrases = [
    "Block OS 1.0 ",
    "DEADBILLI"
]
async function updateStatus(text) {
    status.style.opacity = "0";
    await new Promise(r => setTimeout(r, 800));
    
    status.innerText = text;
    status.style.opacity = "1";
    
    await new Promise(r => setTimeout(r, 1100));
}

async function startAppleStyleBoot() {
    // Пауза перед первым приветствием
    await new Promise(r => setTimeout(r, 500));

    for (let phrase of phrases) {
        await updateStatus(phrase);
    }

    // Финальное исчезновение всего экрана
    bootScreen.style.opacity = "0";
    setTimeout(() => {
        bootScreen.remove();
    }, 500);
}

document.addEventListener('DOMContentLoaded', startAppleStyleBoot);