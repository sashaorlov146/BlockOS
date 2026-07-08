
const OS = {
    config: {
        keys: {
            color: 'blockOS_theme_color',
            alpha: 'blockOS_theme_alpha',
            textColor: 'blockOS_text_color'
        },
        defaults: {
            color: '#1a1a1a',
            alpha: '0.8',
            textColor: '#ffffff'
        }
    },

    Visuals: {
        init() {
            // Находим элементы управления
            this.winPicker = document.getElementById('winColorPicker');
            this.textPicker = document.getElementById('textColorPicker');
            this.alphaSlider = document.getElementById('opacitySlider');

            // Загружаем данные из localStorage или ставим дефолты
            const savedColor = localStorage.getItem(OS.config.keys.color) || OS.config.defaults.color;
            const savedAlpha = localStorage.getItem(OS.config.keys.alpha) || OS.config.defaults.alpha;
            const savedText = localStorage.getItem(OS.config.keys.textColor) || OS.config.defaults.textColor;

            // Если мы в окне настроек — заполняем инпуты
            if (this.winPicker) this.winPicker.value = savedColor;
            if (this.alphaSlider) this.alphaSlider.value = savedAlpha;
            if (this.textPicker) this.textPicker.value = savedText;

            // Применяем настройки ко всей системе
            this.apply(savedColor, savedText, savedAlpha);
        },

        /**
         * Вспомогательный метод для создания RGBA из HEX
         */
        _hexToRgba(hex, alpha) {
            let r, g, b;
            hex = hex.replace('#', '');
            
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else {
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            }
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        },

        /**
         * Метод применения стилей
         */
        apply(color, textColor, alpha) {
            // Если вызвана без параметров (из oninput), берем значения из UI
            const currentWinColor = color || (this.winPicker ? this.winPicker.value : OS.config.defaults.color);
            const currentTextColor = textColor || (this.textPicker ? this.textPicker.value : OS.config.defaults.textColor);
            const currentAlpha = alpha || (this.alphaSlider ? this.alphaSlider.value : OS.config.defaults.alpha);

            // 1. Генерируем RGBA для фона
            const rgbaBackground = this._hexToRgba(currentWinColor, currentAlpha);

            // 2. Обновляем переменные в :root (применяется ко ВСЕМ элементам)
            const root = document.documentElement;
            root.style.setProperty('--window-bg', rgbaBackground);
            root.style.setProperty('--text-color', currentTextColor);
            
            // Создаем вторичный текст (основной цвет с 50% прозрачностью для описаний)
            root.style.setProperty('--text-secondary', currentTextColor + '80');
            
            // Также обновляем Dock (делаем его чуть плотнее окон для эффекта глубины)
            const dockAlpha = Math.min(parseFloat(currentAlpha) + 0.15, 1);
            root.style.setProperty('--dock-bg', this._hexToRgba(currentWinColor, dockAlpha));

            // 3. Сохраняем в память
            localStorage.setItem(OS.config.keys.color, currentWinColor);
            localStorage.setItem(OS.config.keys.textColor, currentTextColor);
            localStorage.setItem(OS.config.keys.alpha, currentAlpha);
        }
    },

    UI: {
        /**
         * Универсальный метод закрытия окон
         */
        close(id) {
            const win = document.getElementById(id);
            if (win) win.style.display = 'none';
        }
    }
};

// Запуск при полной загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    OS.Visuals.init();
});