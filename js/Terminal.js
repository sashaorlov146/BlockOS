const terminal = document.querySelector('#terminalWindow textarea');

let config = {
    user: localStorage.getItem('os_user') || "admin",
    host: "blockos",
    dir: "~",
    version: "0.0.1"
};

const getPrompt = () => `${config.user}@${config.host}:${config.dir}$ `;

const showBanner = () => {
    return `Добро пожаловать в BlockOS v${config.version} LTS\n` +
           `Связь с разработчиком: https://t.me/Koda_SUO\n` +
           `--------------------------------------------------\n` +
           `Удачного программирования, ${config.user}!\n` +
           `Введите 'help' для просмотра списка доступных команд.\n` +
           `--------------------------------------------------\n` +
           getPrompt();
};

if (terminal) {
    terminal.value = showBanner();
    
    terminal.addEventListener('keydown', (e) => {
        const lines = terminal.value.split('\n');
        const lastLine = lines[lines.length - 1];
        const prompt = getPrompt();

        if (e.key === 'Enter') {
            e.preventDefault();

            const input = lastLine.substring(prompt.length).trim();
            const args = input.split(/\s+/);
            const command = args[0].toLowerCase();

            let output = "";

            if (command.length > 0) {
                switch (command) {
                    case 'help':
                        output = "\nКоманды:\n" +
                                 "  user [имя]       сменить имя\n" +
                                 "  neofetch         инфо о системе\n" +
                                 "  ls               список папок\n" +
                                 "  time             время\n" +
                                 "  clear            очистить\n" +
                                 "  exit             закрыть";
                        break;

                    case 'neofetch':
                        output = `\nОС: BlockOS ${config.version}\n` +
                                 `Ядро: Toy-Kernel-0.1\n` +
                                 `Оболочка: bsh\n` +
                                 `Разрешение: ${window.innerWidth}x${window.innerHeight}`;
                        break;

                    case 'ls':
                        output = "\nБраузер Музыка Магазин ";
                        break;

                    case 'user':
                        if (args[1]) {
                            config.user = args[1];
                            localStorage.setItem('os_user', config.user);
                            output = `\n[ok] Пользователь: ${config.user}`;
                        } else {
                            output = "\nИспользование: user [имя]";
                        }
                        break;

                    case 'time':
                        output = `\n${new Date().toLocaleTimeString('ru-RU')}`;
                        break;

                    case 'clear':
                        terminal.value = getPrompt();
                        return;

                    case 'exit':
                        if (typeof closeWindow === 'function') closeWindow('terminalWindow');
                        return;

                    default:
                        output = `\n-bsh: ${command}: команда не найдена`;
                }
            }

            terminal.value += output + "\n" + getPrompt();
            
            setTimeout(() => {
                terminal.scrollTop = terminal.scrollHeight;
            }, 10);
        }

        if (e.key === 'Backspace') {
            const cursorPosition = terminal.selectionStart;
            const currentLineStart = terminal.value.lastIndexOf('\n') + 1;
            if (cursorPosition <= currentLineStart + prompt.length) {
                e.preventDefault();
            }
        }
    });
}

