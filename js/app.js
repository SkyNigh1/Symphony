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
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) {
        console.error('Error: .content-area element not found in the DOM');
        return;
    }
    // Clear only the content below the content-header
    const emptyState = contentArea.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove(); // Remove the empty-state div if it exists
    }

    if (songs.length === 0) {
        contentArea.innerHTML += `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 9l6 6m0-6l-6 6"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <h3>Aucune musique trouvée</h3>
                <p>Commencez par ajouter votre première chanson !</p>
            </div>
        `;
        return;
    }

    const songContainer = document.createElement('div');
    songContainer.className = 'content-grid'; // Create a new div for song cards
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
        songContainer.appendChild(songCard);
    });
    contentArea.appendChild(songContainer);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    initApp();
});

export { songs, currentSong, displayRecentSongs };