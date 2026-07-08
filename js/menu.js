const menu = document.getElementById('menuWindow');

function toggleMenu(event) {
    event.stopPropagation();
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'flex';
        menu.style.flexWrap = 'wrap';
        requestAnimationFrame(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'translateX(-50%) translateY(0)';
        });
    } else {
        closeMenu();
    }
}

function closeMenu() {
    if (!menu || menu.style.display === 'none') return;
    menu.style.opacity = '0';
    menu.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => { menu.style.display = 'none'; }, 300);
}

document.addEventListener('click', (e) => {
    if (menu.style.display === 'flex' && !menu.contains(e.target)) closeMenu();
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('dragstart', () => item.classList.add('dragging'));
    item.addEventListener('dragend', () => item.classList.remove('dragging'));

    item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const targetItem = e.target.closest('.menu-item');
        
        if (targetItem && draggingItem && draggingItem !== targetItem) {
            const items = [...menu.querySelectorAll('.menu-item')];
            if (items.indexOf(draggingItem) < items.indexOf(targetItem)) {
                targetItem.after(draggingItem);
            } else {
                targetItem.before(draggingItem);
            }
        }
    });
});