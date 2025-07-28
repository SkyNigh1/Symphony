import { formatTime } from './utils.js';

let currentSong = null;
let isPlaying = false;
let currentTime = 0;
let duration = 0;
let volume = 0.7; // Valeur par défaut visible

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
            // Correction du positionnement du handle
            if (progressHandle) {
                progressHandle.style.right = `${-7}px`; // Position fixe correcte
            }
        }
    });

    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayPauseButton();
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

    // Barre de progression avec gestion améliorée
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

    progressBar.addEventListener('click', updateProgress);

    function updateProgress(e) {
        if (duration > 0) {
            const rect = progressBar.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const newTime = percent * duration;
            audioPlayer.currentTime = newTime;
            
            // Mise à jour immédiate de l'affichage
            const progress = percent * 100;
            progressFill.style.width = `${progress}%`;
            currentTimeEl.textContent = formatTime(newTime);
        }
    }

    // Contrôle du volume avec gestion améliorée
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

    volumeSlider.addEventListener('click', updateVolume);

    function updateVolume(e) {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setVolume(percent);
    }

    volumeBtn.addEventListener('click', toggleMute);

    // Initialiser le volume
    setVolume(volume);
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
        const coverSrc = song.coverPath || 'assets/images/default-cover.jpg';
        coverImage.src = coverSrc;
        coverImage.alt = song.title;
        
        // Extraire la couleur dominante et appliquer le dégradé
        extractDominantColor(coverSrc).then(color => {
            applyDynamicGradient(color);
        }).catch(() => {
            // Fallback vers les couleurs par défaut
            applyDynamicGradient('#6366f1');
        });
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

    updateQueue();
}

// Fonction pour extraire la couleur dominante d'une image
function extractDominantColor(imageSrc) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                
                // Compter les couleurs
                const colorCount = {};
                for (let i = 0; i < pixels.length; i += 16) { // Échantillonnage
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const alpha = pixels[i + 3];
                    
                    if (alpha > 128) { // Ignorer les pixels transparents
                        const color = `${Math.floor(r/32)*32},${Math.floor(g/32)*32},${Math.floor(b/32)*32}`;
                        colorCount[color] = (colorCount[color] || 0) + 1;
                    }
                }
                
                // Trouver la couleur la plus fréquente
                let maxCount = 0;
                let dominantColor = '100,100,100';
                
                for (const color in colorCount) {
                    if (colorCount[color] > maxCount) {
                        maxCount = colorCount[color];
                        dominantColor = color;
                    }
                }
                
                const [r, g, b] = dominantColor.split(',').map(Number);
                const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                
                resolve(hexColor);
            } catch (error) {
                reject(error);
            }
        };
        
        img.onerror = () => reject(new Error('Impossible de charger l\'image'));
        img.src = imageSrc;
    });
}

// Fonction pour appliquer un dégradé dynamique basé sur la couleur
function applyDynamicGradient(baseColor) {
    const nowPlaying = document.querySelector('.now-playing');
    if (!nowPlaying) return;
    
    // Convertir la couleur hex en RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Créer des variations plus sombres et plus claires
    const darkerColor = `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`;
    const lighterColor = `rgb(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)})`;
    
    // Appliquer le dégradé
    nowPlaying.style.background = `linear-gradient(135deg, ${lighterColor}, ${darkerColor})`;
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
    const playPauseBtn = document.querySelector('.play-pause');
    
    if (playPauseBtn) {
        if (isPlaying) {
            playPauseBtn.classList.add('playing');
        } else {
            playPauseBtn.classList.remove('playing');
        }
    }
    
    // Ne pas modifier directement le style display - laisser le CSS s'en charger via la classe .playing
}

function playNext() {
    if (!currentSong) return;
    
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
        // Correction du positionnement du handle de volume
        volumeHandle.style.right = '-6px'; // Position fixe correcte
    }
}

function toggleMute() {
    const audioPlayer = document.getElementById('audio-player');
    const previousVolume = volume;
    
    if (audioPlayer) {
        if (volume > 0) {
            setVolume(0);
        } else {
            setVolume(previousVolume > 0 ? previousVolume : 0.7);
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