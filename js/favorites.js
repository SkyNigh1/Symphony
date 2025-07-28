import { songs } from './app.js';
import { addFavorite, removeFavorite, getFavorites } from './database.js';
import { playSong } from './player.js';

export function initFavorites() {
    // Écouter les clics sur les boutons favoris
    document.addEventListener('click', (e) => {
        // Bouton favori pour une chanson individuelle
        if (e.target.closest('.song-favorite')) {
            e.stopPropagation();
            const button = e.target.closest('.song-favorite');
            const songId = button.dataset.songId;
            if (!songId) return;

            toggleSongFavorite(songId);
            updateSongFavoriteButton(button, songId);
            
            // Si on est dans la vue Favoris, rafraîchir l'affichage
            const activeNav = document.querySelector('.nav-item.active .nav-link');
            if (activeNav && activeNav.textContent.trim() === 'Favoris') {
                setTimeout(() => {
                    // Import dynamique pour éviter les dépendances circulaires
                    import('./navigation.js').then(({ displayView }) => {
                        if (displayView) displayView('Favoris');
                    });
                }, 100);
            }
        }
        
        // Bouton favori pour un album entier
        if (e.target.closest('.album-favorite')) {
            e.stopPropagation();
            const button = e.target.closest('.album-favorite');
            const album = button.dataset.album;
            if (!album) return;

            toggleAlbumFavorite(album);
            updateAlbumFavoriteButton(button, album);
        }
    });
}

function toggleSongFavorite(songId) {
    const favorites = getFavorites();
    if (favorites.includes(songId)) {
        removeFavorite(songId);
    } else {
        addFavorite(songId);
    }
}

function toggleAlbumFavorite(album) {
    const albumSongs = songs.filter(song => song.album === album);
    const favorites = getFavorites();
    const allFavorited = albumSongs.every(song => favorites.includes(song.id));
    
    if (allFavorited) {
        // Retirer tous les morceaux de l'album des favoris
        albumSongs.forEach(song => removeFavorite(song.id));
    } else {
        // Ajouter tous les morceaux de l'album aux favoris
        albumSongs.forEach(song => addFavorite(song.id));
    }
}

export function updateSongFavoriteButton(button, songId) {
    const favorites = getFavorites();
    const isFavorite = favorites.includes(songId);
    
    if (isFavorite) {
        button.classList.add('active');
        button.querySelector('svg').setAttribute('fill', 'currentColor');
    } else {
        button.classList.remove('active');
        button.querySelector('svg').setAttribute('fill', 'none');
    }
}

export function updateAlbumFavoriteButton(button, album) {
    const albumSongs = songs.filter(song => song.album === album);
    const favorites = getFavorites();
    const allFavorited = albumSongs.every(song => favorites.includes(song.id));
    
    if (allFavorited) {
        button.classList.add('active');
        button.querySelector('svg').setAttribute('fill', 'currentColor');
    } else {
        button.classList.remove('active');
        button.querySelector('svg').setAttribute('fill', 'none');
    }
}

// Fonction pour mettre à jour tous les boutons favoris visibles
export function updateAllFavoriteButtons() {
    // Boutons favoris des chansons
    const songFavoriteButtons = document.querySelectorAll('.song-favorite');
    songFavoriteButtons.forEach(button => {
        const songId = button.dataset.songId;
        if (songId) {
            updateSongFavoriteButton(button, songId);
        }
    });
    
    // Boutons favoris des albums
    const albumFavoriteButtons = document.querySelectorAll('.album-favorite');
    albumFavoriteButtons.forEach(button => {
        const album = button.dataset.album;
        if (album) {
            updateAlbumFavoriteButton(button, album);
        }
    });
}

// Fonction pour vérifier si une chanson est en favori
export function isSongFavorite(songId) {
    return getFavorites().includes(songId);
}

// Fonction pour vérifier si un album est entièrement en favori
export function isAlbumFavorite(album) {
    const albumSongs = songs.filter(song => song.album === album);
    const favorites = getFavorites();
    return albumSongs.length > 0 && albumSongs.every(song => favorites.includes(song.id));
}