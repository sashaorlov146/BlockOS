const playerMain = document.getElementById('m-player');
const playerWidget = document.getElementById('m-playerr');
const titleMain = document.getElementById('m-title');
const titleWidget = document.getElementById('m-titlee');
const uploadInput = document.getElementById('m-upload');
const playlistContainer = document.getElementById('playlist-container');

let queue = [];
let currentIndex = 0;
let db;
let isShuffle = false;
let currentBlobUrl = null;

function sync(master, slave) {
    if (!master || !slave) return;
    master.addEventListener('play', () => { if (slave.paused) slave.play(); });
    master.addEventListener('pause', () => { if (!slave.paused) slave.pause(); });
    master.addEventListener('timeupdate', () => {
        if (Math.abs(master.currentTime - slave.currentTime) > 0.3) {
            slave.currentTime = master.currentTime;
        }
    });
}
sync(playerMain, playerWidget);
sync(playerWidget, playerMain);

const request = indexedDB.open("BlockOS_MusicDB", 1);
request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("songs")) {
        db.createObjectStore("songs", { keyPath: "id" });
    }
};
request.onsuccess = (e) => {
    db = e.target.result;
    loadSongsFromDB();
};

function loadSongsFromDB() {
    const transaction = db.transaction(["songs"], "readonly");
    const store = transaction.objectStore("songs");
    const requestAll = store.getAll();
    requestAll.onsuccess = () => {
        queue = requestAll.result;
        renderPlaylist();
        if (queue.length > 0) setupInitialTrack(0);
    };
}

function loadTrack(index) {
    if (index < 0 || index >= queue.length) return;
    const track = queue[index];
    currentIndex = index;

    if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = URL.createObjectURL(track.file);

    [playerMain, playerWidget].forEach(p => {
        if (p) {
            p.src = currentBlobUrl;
            p.load();
            p.play().catch(() => {});
        }
    });

    [titleMain, titleWidget].forEach(t => { if (t) t.textContent = track.name; });
    renderPlaylist();
}

function setupInitialTrack(index) {
    if (!queue[index]) return;
    const track = queue[index];
    currentIndex = index;
    if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = URL.createObjectURL(track.file);
    [playerMain, playerWidget].forEach(p => { if (p) p.src = currentBlobUrl; });
    [titleMain, titleWidget].forEach(t => { if (t) t.textContent = track.name; });
}

function handleTrackEnd() {
    if (isShuffle && queue.length > 1) {
        let nextIndex;
        do { nextIndex = Math.floor(Math.random() * queue.length); } while (nextIndex === currentIndex);
        loadTrack(nextIndex);
    } else {
        let nextIndex = (currentIndex + 1 >= queue.length) ? 0 : currentIndex + 1;
        if (queue.length > 0) loadTrack(nextIndex);
    }
}

[playerMain, playerWidget].forEach(p => {
    if (p) p.onended = handleTrackEnd;
});

window.toggleShuffle = function() {
    isShuffle = !isShuffle;
    const btn = document.getElementById('m-shuffle');
    if (btn) {
        btn.classList.toggle('active', isShuffle);
        btn.textContent = isShuffle ? " Random: On" : " Random: Off";
    }
};

window.removeTrack = function(index) {
    const id = queue[index].id;
    const transaction = db.transaction(["songs"], "readwrite");
    transaction.objectStore("songs").delete(id);
    
    queue.splice(index, 1);
    
    if (queue.length === 0) {
        [playerMain, playerWidget].forEach(p => { if (p) { p.pause(); p.src = ''; }});
        [titleMain, titleWidget].forEach(t => { if (t) t.textContent = "Пусто"; });
        if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    } else if (index === currentIndex) {
        loadTrack(currentIndex % queue.length);
    } else if (index < currentIndex) {
        currentIndex--;
    }
    renderPlaylist();
};

window.editTrack = function(index) {
    const newName = prompt("Название трека:", queue[index].name);
    if (newName && newName.trim()) {
        queue[index].name = newName;
        const transaction = db.transaction(["songs"], "readwrite");
        transaction.objectStore("songs").put(queue[index]);
        renderPlaylist();
        if (index === currentIndex) {
            [titleMain, titleWidget].forEach(t => { if (t) t.textContent = newName; });
        }
    }
};

function renderPlaylist() {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = '';
    queue.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = `track-item ${index === currentIndex ? 'active' : ''}`;
        item.innerHTML = `
            <div class="track-info-block" onclick="loadTrack(${index})">
                <div class="track-name">${track.name}</div>
            </div>
            <div class="track-controls">
                <button onclick="editTrack(${index})">✎</button>
                <button onclick="removeTrack(${index})" style="color: #ff4444;">×</button>
            </div>
        `;
        playlistContainer.appendChild(item);
    });
}

uploadInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    const transaction = db.transaction(["songs"], "readwrite");
    const store = transaction.objectStore("songs");

    for (const file of files) {
        const trackData = {
            id: Date.now() + Math.random(),
            name: file.name.replace(/\.[^/.]+$/, ""),
            file: file 
        };
        store.add(trackData);
        queue.push(trackData);
    }
    renderPlaylist();
    if (queue.length === files.length) setupInitialTrack(0);
});

const audio = document.getElementById('m-audio-element');
const seekSlider = document.getElementById('m-player');
const playBtn = document.getElementById('m-play');

// Обновление ползунка при проигрывании
audio.addEventListener('timeupdate', () => {
    const value = (audio.currentTime / audio.duration) * 100;
    seekSlider.value = value || 0;
});

// Перемотка через ползунок
seekSlider.addEventListener('input', () => {
    const time = (seekSlider.value * audio.duration) / 100;
    audio.currentTime = time;
});

// Кнопка плей/пауза
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = 'pause';
    } else {
        audio.pause();
        playBtn.innerText = 'play';
    }
});