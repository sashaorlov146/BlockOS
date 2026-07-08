const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('m-upload');

// Подсветка при наведении файлом
['dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
    });
});

dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
    dropZone.classList.remove('dragover');
    fileInput.files = e.dataTransfer.files;
    
    // Вызываем событие change вручную, чтобы сработал твой загрузчик
    fileInput.dispatchEvent(new Event('change'));
});