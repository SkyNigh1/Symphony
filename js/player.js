import { formatTime } from './utils.js';

export function initPlayer() {
    const audio = document.querySelector('#audio-player');
    const playPauseBtn = document.querySelector('.play-pause');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeFill = document.querySelector('.volume-fill');
    const volumeHandle = document.querySelector('.volume-handle');

    // Play/Pause handling
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.classList.add('playing');
        } else {
            audio.pause();
            playPauseBtn.classList.remove('playing');
        }
    });

    // Previous/Next buttons (implement queue logic if needed)
    prevBtn.addEventListener('click', () => {
        // Add logic to play previous song
        console.log('Previous song');
    });

    nextBtn.addEventListener('click', () => {
        // Add logic to play next song
        console.log('Next song');
    });

    // Progress bar update
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progress}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration || 0);
    });

    // Seek functionality
    let isDraggingProgress = false;
    progressBar.addEventListener('mousedown', (e) => {
        isDraggingProgress = true;
        updateProgress(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingProgress) {
            updateProgress(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDraggingProgress = false;
    });

    function updateProgress(e) {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const seekTime = pos * audio.duration;
        audio.currentTime = Math.min(Math.max(seekTime, 0), audio.duration);
        progressFill.style.width = `${pos * 100}%`;
    }

    // Volume control
    let isDraggingVolume = false;
    volumeSlider.addEventListener('mousedown', (e) => {
        isDraggingVolume = true;
        updateVolume(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingVolume) {
            updateVolume(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDraggingVolume = false;
    });

    function updateVolume(e) {
        const rect = volumeSlider.getBoundingClientRect();
        const volume = (e.clientX - rect.left) / rect.width;
        audio.volume = Math.min(Math.max(volume, 0), 1);
        volumeFill.style.width = `${audio.volume * 100}%`;
    }

    volumeBtn.addEventListener('click', () => {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeFill.style.width = '0%';
            volumeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>`;
        } else {
            audio.volume = 1;
            volumeFill.style.width = '100%';
            volumeBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>`;
        }
    });

    // Initialize volume
    audio.volume = 1;
    volumeFill.style.width = '100%';

    // Handle audio metadata
    audio.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audio.duration);
    });
}

export function playSong(song) {
    const audio = document.querySelector('#audio-player');
    const coverImg = document.querySelector('.track-cover img');
    const titleEl = document.querySelector('.track-title');
    const artistEl = document.querySelector('.track-artist');

    audio.src = song.filePath;
    coverImg.src = song.coverPath || 'assets/images/default-cover.jpg';
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    audio.play();
    document.querySelector('.play-pause').classList.add('playing');
}