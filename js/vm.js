function launchOS(url, element) {
    const frame = document.getElementById('vmFrame');
    const loader = document.getElementById('vm-loader');
    
    // 1. Активируем iframe
    frame.src = url;
    frame.style.display = 'block';
    
    // 2. Скрываем надпись загрузки
    loader.style.display = 'none';

    // 3. Красим выбранный пункт в меню
    document.querySelectorAll('.vm-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}