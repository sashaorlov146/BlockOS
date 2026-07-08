async function getWeather() {
    try {
        // 1. Получаем локацию по IP
        const ipRes = await fetch('http://ip-api.com/json/');
        const ipData = await ipRes.json();
        const { lat, lon, city } = ipData;

        // 2. Получаем погоду по координатам
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const weatherData = await weatherRes.json();
        
        const temp = Math.round(weatherData.current_weather.temperature);
        const code = weatherData.current_weather.weathercode;
        const windSpeed = weatherData.current_weather.windspeed;

        // 3. Полный словарь погодных кодов (WMO Weather interpretation codes)
        const descriptions = {
            0: "Ясно",
            1: "Преимущественно ясно",
            2: "Переменная облачность",
            3: "Пасмурно",
            45: "Туман",
            48: "Изморозь",
            51: "Легкая морось",
            53: "Морось",
            55: "Сильная морось",
            61: "Небольшой дождь",
            63: "Умеренный дождь",
            65: "Сильный дождь",
            71: "Небольшой снег",
            73: "Снег",
            75: "Сильный снегопад",
            77: "Снежные зерна",
            80: "Ливневый дождь",
            81: "Сильный ливневый дождь",
            82: "Штормовой ливень",
            85: "Небольшой ливневый снег",
            86: "Сильный ливневый снег",
            95: "Гроза",
            96: "Гроза с небольшим градом",
            99: "Гроза с сильным градом"
        };

        // 4. Финальный вывод в HTML
        // Добавлены проверки на существование элементов в DOM для безопасности
        const tempEl = document.getElementById('temp');
        const locEl = document.getElementById('location');
        const descEl = document.getElementById('desc');
        const windEl = document.getElementById('wind'); // Если планируете добавить такой ID

        if (tempEl) tempEl.innerText = `${temp}°C`;
        if (locEl) locEl.innerText = city;
        if (descEl) descEl.innerText = descriptions[code] || "Неизвестно";
        
        // Дополнительно: вывод скорости ветра, если есть куда выводить
        if (windEl) windEl.innerText = `Ветер: ${windSpeed} км/ч`;

        // Логика смены иконки (пример)
        const hour = new Date().getHours();
        console.log(`BlockOS Weather: Успешное обновление для ${city}. Время: ${hour}:00`);

    } catch (error) {
        const descEl = document.getElementById('desc');
        if (descEl) descEl.innerText = "Ошибка сети";
        console.error("Ошибка BlockOS Weather:", error);
    }
}

// Запуск функции
getWeather();

// Опционально: автоматическое обновление каждые 10 минут
setInterval(getWeather, 600000);