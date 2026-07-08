let browserTabs = [];
let activeTabId = null;

const GOOGLE_HOME = 'https://www.google.com/search?igu=1';
const GOOGLE_SEARCH_PREFIX = 'https://www.google.com/search?igu=1&q=';

// 1. Создание новой вкладки
function createNewTab() {
    const id = Date.now();
    browserTabs.push({
        id: id,
        url: GOOGLE_HOME,
        title: 'New Tab'
    });
    switchTab(id);
}

// 2. Переключение между вкладками
function switchTab(id) {
    activeTabId = id;
    renderTabs();
    renderBrowserContent();
}

// 3. Закрытие вкладки
function closeTab(id, event) {
    if (event) event.stopPropagation(); // Чтобы не срабатывал клик по самой вкладке
    
    // Находим индекс закрываемой вкладки
    const index = browserTabs.findIndex(t => t.id === id);
    browserTabs = browserTabs.filter(t => t.id !== id);
    
    // Если закрыли активную вкладку
    if (activeTabId === id) {
        if (browserTabs.length > 0) {
            // Переключаемся на ближайшую вкладку
            const nextTab = browserTabs[index] || browserTabs[index - 1];
            activeTabId = nextTab.id;
        } else {
            activeTabId = null;
        }
    }
    
    // Если вкладок не осталось — создаем одну пустую
    if (browserTabs.length === 0) {
        createNewTab();
    } else {
        renderTabs();
        renderBrowserContent();
    }
}

// 4. Отрисовка списка вкладок в HTML
function renderTabs() {
    const container = document.getElementById('tabsContainer');
    if (!container) return;

    // Очищаем старые вкладки, кроме кнопки "+"
    const addButton = container.querySelector('.add-tab');
    container.querySelectorAll('.tab').forEach(t => t.remove());

    browserTabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab ${tab.id === activeTabId ? 'active' : ''}`;
        tabEl.onclick = () => switchTab(tab.id);
        
        tabEl.innerHTML = `
            <span>${tab.title}</span>
            <button onclick="closeTab(${tab.id}, event)">×</button>
        `;
        
        container.insertBefore(tabEl, addButton);
    });
}

// 5. Обновление контента (iframe и URL)
function renderBrowserContent() {
    const frame = document.getElementById('browserFrame');
    const urlInput = document.getElementById('browserUrl');
    const activeTab = browserTabs.find(t => t.id === activeTabId);

    if (!activeTab || !frame) return;

    // Обновляем текст в строке поиска
    urlInput.value = (activeTab.url === GOOGLE_HOME) ? '' : activeTab.url;
    
    // Загружаем URL во фрейм
    if (frame.src !== activeTab.url) {
        frame.src = activeTab.url;
    }
}

// 6. Навигация через адресную строку
function navigate(query) {
    const activeTab = browserTabs.find(t => t.id === activeTabId);
    if (!activeTab) return;

    let url = query.trim();
    if (!url) return;

    if (!url.includes('.') || url.includes(' ')) {
        url = GOOGLE_SEARCH_PREFIX + encodeURIComponent(url);
    } else {
        if (!url.startsWith('http')) url = 'https://' + url;
    }

    activeTab.url = url;
    activeTab.title = url.includes('google.com') ? 'Google' : url.replace('https://', '').replace('www.', '').split('/')[0];
    
    renderTabs();
    renderBrowserContent();
}

// Хендлер для Enter в адресной строке
function handleUrlInput(e) {
    if (e.key === 'Enter') {
        navigate(e.target.value);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('BrowserWindow')) {
        createNewTab();
    }
});