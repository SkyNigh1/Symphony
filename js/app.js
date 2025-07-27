import { loadSongs } from './database.js';
import { playSong, initPlayer } from './player.js';
import { initUpload } from './upload.js';
import { initSearch } from './search.js';
import { initNavigation } from './navigation.js';
import { initFavorites } from './favorites.js';

// État global
let songs = [];
let currentSong = null;

// Initialisation
async function initApp() {
    try {
        // Charger les chansons depuis songs.json
        songs = await loadSongs();
        
        // Charger les chansons depuis localStorage (si elles existent)
        const userSongs = JSON.parse(localStorage.getItem('userSongs')) || [];
        songs = [...songs, ...userSongs]; // Fusionner songs.json et userSongs
        console.log('Chansons chargées:', songs);

        // Initialiser les modules
        initPlayer();
        initUpload();
        initSearch();
        initNavigation();
        initFavorites();

        // Afficher les chansons récentes dans la grille
        displayRecentSongs(songs);
    } catch (error) {
        console.error('Erreur lors de l’initialisation:', error);
    }
}

// Afficher les chansons récentes
function displayRecentSongs(songs) {
    const contentGrid = document.querySelector('.content-grid');
    contentGrid.innerHTML = ''; // Vider la grille

    if (songs.length === 0) {
        contentGrid.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 9l3 3m0 0l3-3m-3 3v6"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <h3>Aucune musique trouvée</h3>
                <p>Commencez par ajouter votre première chanson !</p>
            </div>
        `;
        return;
    }

    songs.forEach(song => {
        const songCard = document.createElement('div');
        songCard.className = 'track-card';
        songCard.dataset.songId = song.id; // Ajouter l'ID pour les favoris
        songCard.innerHTML = `
            <div class="track-card-cover">
                <img src="${song.coverPath || 'assets/images/default-cover.jpg'}" alt="${song.title}">
                <div class="track-card-overlay">
                    <button class="play-btn-overlay">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="track-card-info">
                <h3 class="track-card-title">${song.title}</h3>
                <p class="track-card-artist">${song.artist}</p>
                <p class="track-card-album">${song.album}</p>
            </div>
        `;
        songCard.addEventListener('click', () => {
            currentSong = song;
            playSong(song);
        });
        contentGrid.appendChild(songCard);
    });
}

// Lancer l’application
document.addEventListener('DOMContentLoaded', initApp);

export { songs, currentSong, displayRecentSongs };