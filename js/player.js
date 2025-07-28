import { formatTime } from './utils.js';

let currentSong = null;
let isPlaying = false;
let currentTime = 0;
let duration = 0;
let volume = 1;

export function initPlayer() {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.querySelector('.play-pause');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const shuffleBtn = document.querySelector('.shuffle-btn');
    const repeatBtn = document.querySelector('.repeat-btn');
    const volumeBtn = document.querySelector('.volume-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeFill = document.querySelector('.volume-fill');
    const volumeHandle = document.querySelector('.volume-handle');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');

    if (!audioPlayer) {
        console.error('Lecteur audio non trouvé');
        return;
    }

    // Événements du lecteur audio
    audioPlayer.addEventListener('loadedmetadata', () => {
        duration = audioPlayer.duration;
        durationEl.textContent = formatTime(duration);
    });

    audioPlayer.addEventListener('timeupdate', () => {
        currentTime = audioPlayer.currentTime;
        currentTimeEl.textContent = formatTime(currentTime);
        
        if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            progressFill.style.width = `${progress}%`;
            progressHandle.style.left = `${progress}%`;
        }
    });

    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayPauseButton();
        // Auto-play next song si disponible
        playNext();
    });

    audioPlayer.addEventListener('error', (e) => {
        console.error('Erreur de lecture audio:', e);
        alert('Erreur lors de la lecture du fichier audio');
    });

    // Bouton play/pause
    playPauseBtn.addEventListener('click', togglePlayPause);

    // Boutons précédent/suivant
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);

    // Barre de progression
    progressBar.addEventListener('click', (e) => {
        if (duration > 0) {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * duration;
            audioPlayer.currentTime = newTime;
        }
    });

    // Contrôle du volume
    volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        setVolume(percent);
    });

    volumeBtn.addEventListener('click', toggleMute);

    // Initialiser le volume
    setVolume(0.7);
}

export function playSong(song) {
    if (!song || !song.filePath) {
        console.error('Chanson invalide:', song);
        return;
    }

    console.log('Lecture de la chanson:', song);
    currentSong = song;
    
    const audioPlayer = document.getElementById('audio-player');
    const trackTitle = document.querySelector('.track-title');
    const trackArtist = document.querySelector('.track-artist');
    const coverImage = document.querySelector('.cover-image');

    // Mettre à jour l'interface
    if (trackTitle) trackTitle.textContent = song.title;
    if (trackArtist) trackArtist.textContent = song.artist;
    if (coverImage) {
        coverImage.src = song.coverPath || 'assets/images/default-cover.jpg';
        coverImage.alt = song.title;
    }

    // Charger et jouer l'audio
    if (audioPlayer) {
        audioPlayer.src = song.filePath;
        audioPlayer.load();
        
        audioPlayer.addEventListener('canplay', () => {
            audioPlayer.play().then(() => {
                isPlaying = true;
                updatePlayPauseButton();
            }).catch(error => {
                console.error('Erreur lors de la lecture:', error);
                alert('Impossible de lire cette chanson. Vérifiez le lien du fichier.');
            });
        }, { once: true });
    }

    // Mettre à jour la queue
    updateQueue();
}

function togglePlayPause() {
    const audioPlayer = document.getElementById('audio-player');
    
    if (!currentSong || !audioPlayer.src) {
        console.log('Aucune chanson sélectionnée');
        return;
    }

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play().then(() => {
            isPlaying = true;
        }).catch(error => {
            console.error('Erreur lors de la lecture:', error);
        });
    }
    
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    
    if (playIcon && pauseIcon) {
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }
}

function playNext() {
    if (!currentSong) return;
    
    // Import dynamique pour éviter les dépendances circulaires
    import('./app.js').then(({ songs }) => {
        const currentIndex = songs.findIndex(song => song.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        if (songs[nextIndex]) {
            playSong(songs[nextIndex]);
        }
    });
}

function playPrevious() {
    if (!currentSong) return;
    
    import('./app.js').then(({ songs }) => {
        const currentIndex = songs.findIndex(song => song.id === currentSong.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
        if (songs[prevIndex]) {
            playSong(songs[prevIndex]);
        }
    });
}

function setVolume(vol) {
    volume = Math.max(0, Math.min(1, vol));
    const audioPlayer = document.getElementById('audio-player');
    const volumeFill = document.querySelector('.volume-fill');
    const volumeHandle = document.querySelector('.volume-handle');
    
    if (audioPlayer) {
        audioPlayer.volume = volume;
    }
    
    if (volumeFill && volumeHandle) {
        const percent = volume * 100;
        volumeFill.style.width = `${percent}%`;
        volumeHandle.style.left = `${percent}%`;
    }
}

function toggleMute() {
    const audioPlayer = document.getElementById('audio-player');
    if (audioPlayer) {
        if (audioPlayer.volume > 0) {
            audioPlayer.volume = 0;
            setVolume(0);
        } else {
            setVolume(0.7);
        }
    }
}

function updateQueue() {
    const queueList = document.querySelector('.queue-list');
    if (!queueList) return;

    // Pour l'instant, afficher un message simple
    queueList.innerHTML = `
        <div class="queue-empty">
            <p>Lecture en cours: ${currentSong?.title || 'Aucune chanson'}</p>
        </div>
    `;
}