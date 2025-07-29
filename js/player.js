import { formatTime } from './utils.js';
import { songs } from './app.js';

let currentSong = null;
let isPlaying = false;
let currentTime = 0;
let duration = 0;
let volume = 0.7;

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
            if (progressHandle) {
                progressHandle.style.right = `${-7}px`;
            }
        }
    });

    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        updatePlayPauseButton();
    });

    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayPauseButton();
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

    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);

    // Gestion de la barre de progression
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
            
            const progress = percent * 100;
            progressFill.style.width = `${progress}%`;
            currentTimeEl.textContent = formatTime(newTime);
        }
    }

    // Gestion du volume
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
        console.log('Chargement de la cover:', coverSrc);
        coverImage.src = coverSrc;
        coverImage.alt = song.title;
        
        // Extraire les couleurs et appliquer le dégradé
        console.log('Début extraction couleur...');
        extractHarmoniousColors(coverSrc).then(colors => {
            console.log('Couleurs extraites avec succès:', colors);
            applyHarmoniousGradient(colors);
        }).catch(error => {
            console.log('Erreur extraction couleur:', error);
            const fallbackColors = generateHarmoniousColorsFromText(song.title + song.artist);
            console.log('Utilisation couleurs fallback:', fallbackColors);
            applyHarmoniousGradient(fallbackColors);
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

// Fonction améliorée pour extraire des couleurs harmonieuses
function extractHarmoniousColors(imageSrc) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const size = 150;
                canvas.width = size;
                canvas.height = size;
                
                ctx.drawImage(img, 0, 0, size, size);
                
                const imageData = ctx.getImageData(0, 0, size, size);
                const pixels = imageData.data;
                
                // Extraire plusieurs couleurs principales
                const colorData = [];
                
                // Échantillonnage en grille pour une meilleure représentation
                for (let y = 0; y < size; y += 10) {
                    for (let x = 0; x < size; x += 10) {
                        const i = (y * size + x) * 4;
                        const r = pixels[i];
                        const g = pixels[i + 1];
                        const b = pixels[i + 2];
                        const alpha = pixels[i + 3];
                        
                        if (alpha > 200) { // Ignorer les pixels transparents
                            const brightness = (r + g + b) / 3;
                            const saturation = getSaturation(r, g, b);
                            
                            // Éviter les couleurs trop extrêmes
                            if (brightness > 15 && brightness < 240 && saturation > 0.1) {
                                colorData.push({ r, g, b, brightness, saturation });
                            }
                        }
                    }
                }
                
                if (colorData.length === 0) {
                    throw new Error('Aucune couleur valide trouvée');
                }
                
                // Grouper les couleurs par similarité et luminosité
                const colorGroups = groupSimilarColors(colorData);
                
                // Sélectionner les couleurs les plus représentatives
                const dominantColors = selectDominantColors(colorGroups);
                
                // Créer une palette harmonieuse
                const palette = createHarmoniousPalette(dominantColors);
                
                console.log('Palette créée:', palette);
                resolve(palette);
                
            } catch (error) {
                console.log('Erreur canvas:', error);
                reject(error);
            }
        };
        
        img.onerror = () => {
            console.log('Erreur de chargement image');
            reject(new Error('Image loading failed'));
        };
        
        img.src = imageSrc;
        
        setTimeout(() => {
            if (!img.complete) {
                reject(new Error('Image loading timeout'));
            }
        }, 3000);
    });
}

// Calculer la saturation d'une couleur RGB
function getSaturation(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    if (max === 0) return 0;
    return delta / max;
}

// Grouper les couleurs similaires
function groupSimilarColors(colorData) {
    const groups = [];
    const threshold = 40; // Seuil de similarité
    
    colorData.forEach(color => {
        let foundGroup = false;
        
        for (let group of groups) {
            const avgColor = group.average;
            const distance = Math.sqrt(
                Math.pow(color.r - avgColor.r, 2) +
                Math.pow(color.g - avgColor.g, 2) +
                Math.pow(color.b - avgColor.b, 2)
            );
            
            if (distance < threshold) {
                group.colors.push(color);
                // Recalculer la moyenne
                const sum = group.colors.reduce((acc, c) => ({
                    r: acc.r + c.r,
                    g: acc.g + c.g,
                    b: acc.b + c.b
                }), { r: 0, g: 0, b: 0 });
                
                group.average = {
                    r: Math.round(sum.r / group.colors.length),
                    g: Math.round(sum.g / group.colors.length),
                    b: Math.round(sum.b / group.colors.length)
                };
                foundGroup = true;
                break;
            }
        }
        
        if (!foundGroup) {
            groups.push({
                colors: [color],
                average: { r: color.r, g: color.g, b: color.b }
            });
        }
    });
    
    return groups;
}

// Sélectionner les couleurs dominantes
function selectDominantColors(colorGroups) {
    // Trier par nombre de couleurs dans le groupe
    colorGroups.sort((a, b) => b.colors.length - a.colors.length);
    
    // Prendre les 3-5 groupes les plus importants
    const topGroups = colorGroups.slice(0, Math.min(5, colorGroups.length));
    
    return topGroups.map(group => {
        const avg = group.average;
        return {
            r: avg.r,
            g: avg.g,
            b: avg.b,
            weight: group.colors.length,
            brightness: (avg.r + avg.g + avg.b) / 3
        };
    });
}

// Créer une palette harmonieuse
function createHarmoniousPalette(dominantColors) {
    if (dominantColors.length === 0) {
        return generateHarmoniousColorsFromText('default');
    }
    
    // Trier par poids (importance) et luminosité
    dominantColors.sort((a, b) => b.weight - a.weight);
    
    const primary = dominantColors[0];
    
    // Créer des variations harmonieuses de la couleur principale
    const palette = {
        primary: rgbToHex(primary.r, primary.g, primary.b),
        light: rgbToHex(
            Math.min(255, Math.round(primary.r * 1.3 + 40)),
            Math.min(255, Math.round(primary.g * 1.3 + 40)),
            Math.min(255, Math.round(primary.b * 1.3 + 40))
        ),
        dark: rgbToHex(
            Math.max(0, Math.round(primary.r * 0.6 - 20)),
            Math.max(0, Math.round(primary.g * 0.6 - 20)),
            Math.max(0, Math.round(primary.b * 0.6 - 20))
        ),
        accent: dominantColors.length > 1 ? 
            rgbToHex(dominantColors[1].r, dominantColors[1].g, dominantColors[1].b) :
            createComplementaryColor(primary.r, primary.g, primary.b)
    };
    
    // Ajuster la saturation et la luminosité pour un meilleur rendu
    return adjustPaletteForBackground(palette);
}

// Créer une couleur complémentaire
function createComplementaryColor(r, g, b) {
    // Convertir en HSL
    const hsl = rgbToHsl(r, g, b);
    
    // Décaler la teinte de 180° pour obtenir la complémentaire
    const complementaryHue = (hsl.h + 180) % 360;
    
    // Ajuster la saturation et la luminosité
    const adjustedHsl = {
        h: complementaryHue,
        s: Math.min(70, hsl.s * 0.8), // Réduire un peu la saturation
        l: Math.max(30, Math.min(70, hsl.l)) // Ajuster la luminosité
    };
    
    const rgb = hslToRgb(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Ajuster la palette pour un meilleur rendu en arrière-plan
function adjustPaletteForBackground(palette) {
    // Convertir toutes les couleurs en HSL pour les ajuster
    const colors = {};
    
    Object.keys(palette).forEach(key => {
        const hex = palette[key];
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Ajustements pour un meilleur rendu en arrière-plan
        let adjustedHsl = { ...hsl };
        
        switch (key) {
            case 'light':
                adjustedHsl.l = Math.max(60, Math.min(85, hsl.l + 20));
                adjustedHsl.s = Math.max(20, hsl.s * 0.7);
                break;
            case 'dark':
                adjustedHsl.l = Math.max(15, Math.min(40, hsl.l - 15));
                adjustedHsl.s = Math.max(30, hsl.s * 0.8);
                break;
            case 'primary':
                adjustedHsl.l = Math.max(35, Math.min(65, hsl.l));
                adjustedHsl.s = Math.max(25, Math.min(75, hsl.s));
                break;
            case 'accent':
                adjustedHsl.l = Math.max(30, Math.min(60, hsl.l));
                adjustedHsl.s = Math.max(30, Math.min(80, hsl.s));
                break;
        }
        
        const adjustedRgb = hslToRgb(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l);
        colors[key] = rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
    });
    
    return colors;
}

// Fonction de fallback pour générer des couleurs harmonieuses depuis du texte
function generateHarmoniousColorsFromText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash) % 360;
    const baseHsl = {
        h: hue,
        s: 50 + (Math.abs(hash) % 25), // 50-75%
        l: 45 + (Math.abs(hash) % 20)  // 45-65%
    };
    
    const baseRgb = hslToRgb(baseHsl.h, baseHsl.s, baseHsl.l);
    
    return {
        primary: rgbToHex(baseRgb.r, baseRgb.g, baseRgb.b),
        light: hslToHex(baseHsl.h, baseHsl.s * 0.7, Math.min(80, baseHsl.l + 25)),
        dark: hslToHex(baseHsl.h, baseHsl.s * 0.9, Math.max(25, baseHsl.l - 20)),
        accent: hslToHex((baseHsl.h + 30) % 360, baseHsl.s * 0.8, baseHsl.l)
    };
}

// Appliquer le dégradé harmonieux
function applyHarmoniousGradient(colors) {
    const nowPlaying = document.querySelector('.now-playing');
    if (!nowPlaying) return;
    
    console.log('Application du dégradé harmonieux avec les couleurs:', colors);
    
    // Créer un dégradé complexe et élégant
    const gradient = `
        linear-gradient(135deg, 
            ${colors.light} 0%, 
            ${colors.primary} 40%, 
            ${colors.dark} 85%, 
            ${colors.accent} 100%
        )
    `;
    
    nowPlaying.style.background = gradient;
    nowPlaying.style.transition = 'background 1s ease-in-out';
    
    // Ajouter un overlay subtil pour améliorer la lisibilité du texte
    nowPlaying.style.position = 'relative';
    
    // Créer ou mettre à jour l'overlay
    let overlay = nowPlaying.querySelector('.gradient-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'gradient-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, 
                rgba(0,0,0,0.1) 0%, 
                rgba(0,0,0,0.05) 50%, 
                rgba(0,0,0,0.15) 100%
            );
            pointer-events: none;
            border-radius: inherit;
        `;
        nowPlaying.appendChild(overlay);
    }
    
    // Mettre à jour les variables CSS pour d'autres éléments si nécessaire
    document.documentElement.style.setProperty('--dynamic-primary', colors.primary);
    document.documentElement.style.setProperty('--dynamic-accent', colors.accent);
}

// Fonctions utilitaires de conversion de couleurs
function rgbToHex(r, g, b) {
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function hslToHex(h, s, l) {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Reste des fonctions (inchangées)
function togglePlayPause() {
    const audioPlayer = document.getElementById('audio-player');
    
    if (!currentSong || !audioPlayer.src) {
        console.log('Aucune chanson sélectionnée');
        return;
    }

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        updatePlayPauseButton();
    } else {
        audioPlayer.play().then(() => {
            isPlaying = true;
            updatePlayPauseButton();
        }).catch(error => {
            console.error('Erreur lors de la lecture:', error);
            isPlaying = false;
            updatePlayPauseButton();
        });
    }
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
}

function playNext() {
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    if (songs[nextIndex]) {
        playSong(songs[nextIndex]);
    }
}

function playPrevious() {
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
    if (songs[prevIndex]) {
        playSong(songs[prevIndex]);
    }
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
        volumeHandle.style.right = '-6px';
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

    if (!currentSong || songs.length === 0) {
        queueList.innerHTML = `
            <div class="queue-empty">
                <p>Aucune chanson dans la file d'attente</p>
            </div>
        `;
        return;
    }

    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    // Inclure toutes les chansons à partir de l'index actuel + 1, et boucler si nécessaire
    const queueSongs = [];
    for (let i = 0; i < songs.length; i++) {
        const index = (currentIndex + 1 + i) % songs.length;
        queueSongs.push(songs[index]);
    }

    queueList.innerHTML = queueSongs.length > 0 ? '' : `
        <div class="queue-empty">
            <p>Aucune chanson à suivre</p>
        </div>
    `;

    queueSongs.forEach(song => {
        const queueItem = document.createElement('div');
        queueItem.className = 'queue-item';
        queueItem.dataset.songId = song.id;

        queueItem.innerHTML = `
            <div class="queue-item-cover">
                <img src="${song.coverPath || 'assets/images/default-cover.jpg'}" alt="${song.title}">
            </div>
            <div class="queue-item-info">
                <h3 class="queue-item-title">${song.title}</h3>
                <p class="queue-item-artist">${song.artist}</p>
            </div>
            <div class="queue-item-actions">
                <button class="queue-action-btn favorite-btn song-favorite" data-song-id="${song.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                </button>
            </div>
        `;

        queueItem.addEventListener('click', (e) => {
            if (!e.target.closest('.queue-action-btn')) {
                console.log('Playing song from queue:', song.id);
                playSong(song);
            }
        });

        const favoriteBtn = queueItem.querySelector('.song-favorite');
        // Initialiser l'état du bouton favori
        import('./favorites.js').then(({ isSongFavorite, updateSongFavoriteButton }) => {
            const isFavorite = isSongFavorite(song.id);
            updateSongFavoriteButton(favoriteBtn, song.id);
            console.log(`Initial favorite state for song ${song.id}: ${isFavorite}`);
        });

        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`Favorite button clicked for song ${song.id}`);
            import('./favorites.js').then(({ toggleSongFavorite, updateSongFavoriteButton, updateAllFavoriteButtons }) => {
                toggleSongFavorite(song.id);
                updateSongFavoriteButton(favoriteBtn, song.id);
                // Mettre à jour tous les boutons favoris pour synchroniser l'interface
                updateAllFavoriteButtons();
                console.log(`Favorites updated for song ${song.id}. Current favorites:`, JSON.parse(localStorage.getItem('favorites') || '[]'));
            }).catch(error => {
                console.error('Error importing favorites.js:', error);
            });
        });

        queueList.appendChild(queueItem);
    });
}