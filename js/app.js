import { loadSongs } from './database.js';
import { playSong, initPlayer } from './player.js';
import { initUpload } from './upload.js';
import { initSearch } from './search.js';
import { initNavigation } from './navigation.js';
import { initFavorites, updateAllFavoriteButtons } from './favorites.js';

let songs = [];
let currentSong = null;

async function initApp() {
    try {
        songs = await loadSongs();
        const userSongs = JSON.parse(localStorage.getItem('userSongs')) || [];
        songs = [...songs, ...userSongs];
        console.log('Chansons chargées:', songs);

        // Verify DOM is loaded
        if (!document.querySelector('.content-grid')) {
            console.error('content-grid element not found in DOM');
            return;
        }

        initPlayer();
        initUpload();
        initSearch();
        initNavigation();
        initFavorites();
        displayRecentSongs(songs);
        updateAllFavoriteButtons();
    } catch (error) {
        console.error('Erreur lors de l’initialisation:', error);
    }
}

function displayRecentSongs(songs) {
    const contentGrid = document.querySelector('.content-grid');
    if (!contentGrid) {
        console.error('content-grid element not found');
        return;
    }
    contentGrid.innerHTML = '';

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
        songCard.dataset.songId = song.id;
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

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing app');
    initApp();
});

export { songs, currentSong, displayRecentSongs };