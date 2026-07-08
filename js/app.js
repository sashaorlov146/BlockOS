function installApp(appId) {
    const app = document.getElementById(appId);
    if (app) {
        app.classList.add('installed');
        localStorage.setItem(appId, 'installed');
        console.log(`Система: ${appId} успешно установлено.`);
    }
}

function deleteApp(appId) {
    const app = document.getElementById(appId);
    if (app) {
        app.classList.remove('installed');
        localStorage.removeItem(appId);
        console.log(`Система: ${appId} удалено.`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const apps = document.querySelectorAll('.app');
    apps.forEach(app => {
        if (localStorage.getItem(app.id) === 'installed') {
            app.classList.add('installed');
        }
    });
});