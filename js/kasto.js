(function() {
  const themeLink = document.getElementById('theme-link');
  // Список доступных папок
  const themes = ['css', 'Aero'];
  const savedFolder = localStorage.getItem('theme-folder') || 'css';

  // Функция для смены пути в <link>
  function updateThemeHref(folder) {
    if (!themeLink) return;
    let href = themeLink.getAttribute('href');
    
    // Заменяем текущую папку на новую
    themes.forEach(t => {
      if (href.includes(t + '/')) {
        themeLink.setAttribute('href', href.replace(t + '/', folder + '/'));
      }
    });
  }

  // Инициализация при загрузке
  if (themeLink) {
    updateThemeHref(savedFolder);
  }

  // Работа с блоками выбора
  const blocks = {
    'css': document.querySelector('.kasto .BlockOS'),
    'Aero': document.querySelector('.kasto .Aero')
  };

  function updateDOM(activeFolder) {
    themes.forEach(folder => {
      if (blocks[folder]) {
        if (folder === activeFolder) {
          blocks[folder].classList.add('active-theme');
        } else {
          blocks[folder].classList.remove('active-theme');
        }
      }
    });
  }

  // Применяем состояние
  updateDOM(savedFolder);

  // Добавляем обработчики событий
  themes.forEach(folder => {
    const block = blocks[folder];
    if (block) {
      const link = block.querySelector('a');
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.setItem('theme-folder', folder);
          updateThemeHref(folder);
          updateDOM(folder);
        });
      }
    }
  });
})();