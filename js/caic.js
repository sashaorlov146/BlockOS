let display = document.getElementById('calc-display');

function appendCalc(val) {
    if (display.value === '0') display.value = val;
    else display.value += val;
}

function clearCalc() {
    display.value = '0';
}

function deleteLast() {
    display.value = display.value.slice(0, -1) || '0';
}

function calculate() {
    try {
        // Используем Function вместо eval для безопасности и корректности
        display.value = new Function('return ' + display.value.replace(/×/g, '*').replace(/÷/g, '/'))();
    } catch {
        display.value = 'Error';
        setTimeout(clearCalc, 1500);
    }
}