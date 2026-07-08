const editor = document.getElementById('codeEditor');

// РАСШИРЕННЫЙ СЛОВАРЬ (HTML + CSS)
const commands = [
    // --- HTML Структура ---
    '!DOCTYPE html', 'html', 'head', 'body', 'meta', 'title', 'link', 'style', 'script',
    
    // --- Мета-теги (полные строки для быстрого вставки) ---
    'meta charset="UTF-8"', 
    'meta name="viewport" content="width=device-width, initial-scale=1.0"',
    'meta name="description" content=""',
    'meta http-equiv="X-UA-Compatible" content="ie=edge"',

    // --- HTML5 Теги ---
    'header', 'nav', 'main', 'section', 'article', 'aside', 'footer', 'div', 'span',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'img', 'ul', 'ol', 'li', 'button', 
    'input', 'form', 'label', 'textarea', 'select', 'option', 'table', 'tr', 'td', 'th',
    'canvas', 'svg', 'iframe', 'video', 'audio', 'br', 'hr', 'strong', 'em', 'code',
    
    // --- Атрибуты ---
    'class=""', 'id=""', 'href=""', 'src=""', 'type=""', 'value=""', 'placeholder=""', 
    'onclick=""', 'style=""', 'alt=""', 'name=""', 'action=""', 'method=""', 'target=""',
    'rel="stylesheet"', 'href="style.css"', 'src="script.js"',

    // --- CSS ---
    'display', 'position', 'top', 'left', 'right', 'bottom', 'width', 'height', 'min-width', 
    'max-width', 'min-height', 'max-height', 'background', 'background-color', 'color', 
    'border', 'border-radius', 'border-style', 'padding', 'padding-top', 'padding-bottom', 
    'margin', 'margin-top', 'margin-bottom', 'font-family', 'font-size', 'font-weight', 
    'text-align', 'text-decoration', 'line-height', 'cursor', 'z-index', 'opacity', 
    'overflow', 'visibility', 'transition', 'transform', 'box-shadow', 'backdrop-filter', 
    'flex', 'flex-direction', 'justify-content', 'align-items', 'grid', 'grid-template-columns',
    
    // --- JavaScript ---
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'switch', 
    'case', 'break', 'try', 'catch', 'import', 'export', 'default', 'class', 'extends',
    'document.getElementById', 'document.querySelector', 'document.querySelectorAll',
    'addEventListener', 'console.log', 'alert', 'prompt', 'window.onload', 'localStorage',
    'JSON.parse', 'JSON.stringify', 'setTimeout', 'setInterval', 'parentElement',
    'appendChild', 'removeChild', 'innerHTML', 'style.setProperty', 'classList.add'
];

if (editor) {
    editor.addEventListener('keydown', function(e) {
        const start = this.selectionStart;
        const end = this.selectionEnd;
        const value = this.value;

        // 1. УМНЫЕ СКОБКИ <>
        if (e.key === '<') {
            e.preventDefault();
            this.value = value.substring(0, start) + '<>' + value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
            return;
        }

        // 2. ЛОГИКА АВТОЗАПОЛНЕНИЯ (Теперь на SHIFT)
        if (e.key === 'Shift') {
            // Получаем текст перед курсором
            const textBefore = value.substring(0, start);
            const words = textBefore.split(/[\s\n<]+/); 
            const lastWord = words[words.length - 1];

            // Проверяем, есть ли что дополнять, чтобы Shift не блокировал обычный ввод
            if (lastWord.length > 0) {
                const match = commands.find(cmd => cmd.startsWith(lastWord));
                
                if (match) {
                    e.preventDefault(); // Блокируем стандартное действие, только если нашли совпадение

                    const selfClosingTags = ['meta', 'link', 'br', 'hr', 'img', 'input'];
                    const htmlTags = ['div', 'span', 'h1', 'h2', 'h3', 'p', 'a', 'ul', 'ol', 'li', 'button', 'section', 'script', 'style', 'header', 'footer', 'nav', 'main', 'canvas', 'html', 'body', 'head', 'title'];

                    // --- 2.1 !DOCTYPE ---
                    if (match === '!DOCTYPE html') {
                        this.value = value.substring(0, start - lastWord.length) + "<!DOCTYPE html>" + value.substring(end);
                        this.selectionStart = this.selectionEnd = start - lastWord.length + 15;
                        return;
                    }

                    // --- 2.2 Одиночные теги и Мета ---
                    if (selfClosingTags.includes(match) || match.startsWith('meta ')) {
                        this.value = value.substring(0, start - lastWord.length) + "<" + match + ">" + value.substring(end);
                        this.selectionStart = this.selectionEnd = start - lastWord.length + match.length + 2;
                        return;
                    }

                    // --- 2.3 Парные теги (Emmet) ---
                    if (htmlTags.includes(match)) {
                        const hasOpeningBracket = textBefore.trim().endsWith('<' + lastWord);
                        
                        if (hasOpeningBracket) {
                            const insertText = match.slice(lastWord.length) + "></" + match + ">";
                            this.value = value.substring(0, start) + insertText + value.substring(end);
                            this.selectionStart = this.selectionEnd = start + (match.length - lastWord.length) + 1;
                        } else {
                            this.value = value.substring(0, start - lastWord.length) + "<" + match + "></" + match + ">" + value.substring(end);
                            this.selectionStart = this.selectionEnd = start - lastWord.length + match.length + 2;
                        }
                        return;
                    }

                    // --- 2.4 Атрибуты, CSS и JS ---
                    const insertText = match.slice(lastWord.length);
                    this.value = value.substring(0, start) + insertText + value.substring(end);
                    this.selectionStart = this.selectionEnd = start + insertText.length;
                    
                    if (match.endsWith('""')) {
                        this.selectionStart = this.selectionEnd = this.selectionStart - 1;
                    }
                }
            }
        }

        // 3. УМНЫЙ ENTER
        if (e.key === 'Enter') {
            const charBefore = value.substring(start - 1, start);
            const charAfter = value.substring(start, start + 1);

            if (charBefore === '>' && charAfter === '<') {
                e.preventDefault();
                const indent = "    "; 
                this.value = value.substring(0, start) + "\n" + indent + "\n" + value.substring(end);
                this.selectionStart = this.selectionEnd = start + indent.length + 1;
            }
        }
    });

    editor.addEventListener('input', updateLineNumbers);
    
    editor.addEventListener('scroll', () => {
        const lineNumbers = document.querySelector('.line-numbers');
        if (lineNumbers) lineNumbers.scrollTop = editor.scrollTop;
    });
}