// player.js
import { formatTime } from './utils.js';

export function initPlayer() {
    const audio = document.querySelector('#audio-player');
    const playPauseBtn = document.querySelector('.play-pause');
    const prevBtn = document.querySelector('.control-btn:first-child');
    const nextBtn = document.querySelector('.control-btn:last-child');
    const progressBar = document.querySelector('.progress-fill');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const volumeSlider = document.querySelector('.volume-fill');

    // Gestion play/pause
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.classList.add('playing');
        } else {
            audio.pause();
            playPauseBtn.classList.remove('playing');
        }
    });

    // Mise à jour de la barre de progression
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    });

    // Contrôle du volume
    volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.parentElement.getBoundingClientRect();
        const volume = (e.clientX - rect.left) / rect.width;
        audio.volume = Math.min(Math.max(volume, 0), 1);
        volumeSlider.style.width = `${audio.volume * 100}%`;
    });

    // Initialisation du volume
    audio.volume = 1;
    volumeSlider.style.width = '100%';
}

export function playSong(song) {
    const audio = document.querySelector('#audio-player');
    const coverImg = document.querySelector('.track-cover img');
    const titleEl = document.querySelector('.track-title');
    const artistEl = document.querySelector('.track-artist');

    audio.src = song.filePath; // Lien Google Drive
    coverImg.src = song.coverPath || 'assets/images/default-cover.jpg';
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    audio.play();
    document.querySelector('.play-pause').classList.add('playing');
}