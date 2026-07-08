let isDragging = false;
let currentWindow = null;
let offsetX = 0;
let offsetY = 0;

function openWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'flex';
        focusWindow(win);
        if (!win.style.top || win.style.top === "") {
            win.style.top = '100px';
            win.style.left = '100px';
        }
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'none';
    }
}

function focusWindow(win) {
    document.querySelectorAll('.windows').forEach(w => w.style.zIndex = "1");
    win.style.zIndex = "100";
}

function toggleMenu(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const menu = document.getElementById('menuWindow');
    if (!menu) return;

    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'flex';
        setTimeout(() => { menu.style.opacity = '1'; }, 10);
    } else {
        menu.style.opacity = '0';
        setTimeout(() => { menu.style.display = 'none'; }, 300);
    }
}

document.addEventListener('mousedown', (e) => {
    const header = e.target.closest('.window-header');
    if (header) {
        isDragging = true;
        currentWindow = header.closest('.windows');
        offsetX = e.clientX - currentWindow.offsetLeft;
        offsetY = e.clientY - currentWindow.offsetTop;
        focusWindow(currentWindow);
        e.preventDefault();
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging && currentWindow) {
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        if (y < 0) y = 0; 
        currentWindow.style.left = x + 'px';
        currentWindow.style.top = y + 'px';
    }

    const moveHandler = (ev) => {
        let x = ev.clientX - sx;
        let y = ev.clientY - sy;

        // Прилипание (Snapping)
        if (Math.abs(x) < SNAP) x = 0;
        if (Math.abs(y) < SNAP) y = 0;

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    };
    
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    currentWindow = null;
});

document.addEventListener('click', function(e) {
    const menu = document.getElementById('menuWindow');
    if (menu && menu.style.display === 'flex') {
        if (!menu.contains(e.target)) {
            menu.style.opacity = '0';
            setTimeout(() => { menu.style.display = 'none'; }, 300);
        }
    }
});
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const menu = document.getElementById('context-menu');
    
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;
    menu.style.display = 'block';
});

document.addEventListener('click', () => {
    document.getElementById('context-menu').style.display = 'none';
});
const menu = document.querySelector('.paic');
const wallpaperInput = document.getElementById('wallpaper-input');
const changeBtn = document.getElementById('change-wallpaper');

const savedWallpaper = localStorage.getItem('blockos_bg');
if (savedWallpaper) {
    document.body.style.backgroundImage = `url(${savedWallpaper})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu.style.display = 'block';
    menu.style.top = `${e.pageY}px`;
    menu.style.left = `${e.pageX}px`;
});

document.addEventListener('click', () => {
    menu.style.display = 'none';
});

changeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    wallpaperInput.click();
});

wallpaperInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
        const base64String = reader.result;
        
        document.body.style.backgroundImage = `url(${base64String})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        
        localStorage.setItem('blockos_bg', base64String);
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});

document.addEventListener('contextmenu', event => event.preventDefault());

