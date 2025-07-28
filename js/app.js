import { loadSongs } from './database.js';
import { initUpload } from './upload.js';
import { initSearch } from './search.js';
import { initNavigation } from './navigation.js';
import { initFavorites, updateAllFavoriteButtons } from './favorites.js';
import { initPlayer } from './player.js';
import { formatTime } from './utils.js';
import { getFavorites } from './database.js';

// Variable globale pour stocker les chansons
export let songs = [];

// Fonction pour créer une carte de chanson avec bouton favori
export function createSongCardWithFavorite(song) {
    const songCard = document.createElement('div');
    songCard.className = 'track-card';
    songCard.dataset.songId = song.id;
    
    songCard.innerHTML = `
        <div class="track-card-cover">
            <img src="${song.coverPath || 'assets/images/default-cover.jpg'}" alt="${song.title}">
            <div class="track-card-overlay">
                <button class="play-btn-overlay">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>
            </div>
        </div>
        <div class="track-card-actions">
            <button class="favorite-btn song-favorite" data-song-id="${song.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
            </button>
        </div>
        <div class="track-card-info">
            <h3 class="track-card-title">${song.title}</h3>
            <p class="track-card-artist">${song.artist}</p>
            <p class="track-card-album">${song.album}</p>
        </div>
    `;
    
    // Ajouter l'événement de clic pour jouer la chanson
    songCard.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-btn')) {
            import('./player.js').then(({ playSong }) => {
                playSong(song);
            });
        }
    });
    
    return songCard;
}

// Fonction pour afficher les chansons récentes
export function displayRecentSongs(songsToDisplay) {
    const contentArea = document.querySelector('.content-area');
    const emptyState = contentArea.querySelector('.empty-state');
    
    // Supprimer l'état vide s'il existe
    if (emptyState) {
        emptyState.remove();
    }
    
    // Supprimer la grille existante s'il y en a une
    const existingGrid = contentArea.querySelector('.content-grid');
    if (existingGrid) {
        existingGrid.remove();
    }

    if (songsToDisplay.length === 0) {
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

    // Créer la grille de contenu
    const contentGrid = document.createElement('div');
    contentGrid.className = 'content-grid';
    
    songsToDisplay.forEach(song => {
        const songCard = createSongCardWithFavorite(song);
        contentGrid.appendChild(songCard);
    });
    
    contentArea.appendChild(contentGrid);
    
    // Mettre à jour les boutons favoris après un court délai
    setTimeout(() => {
        updateAllFavoriteButtons();
    }, 100);
}

// Fonction d'initialisation principale
async function init() {
    try {
        console.log('Initialisation de l\'application...');
        
        // Charger les chansons depuis le fichier JSON
        const jsonSongs = await loadSongs();
        
        // Fusionner les chansons
        songs.length = 0; // Vider le tableau
        songs.push(...jsonSongs);
        
        console.log('Chansons chargées:', songs);
        
        // Afficher les chansons récentes
        displayRecentSongs(songs);
        
        // Initialiser tous les modules
        initUpload();
        initSearch();
        initNavigation();
        initFavorites();
        initPlayer();
        
        console.log('Application initialisée avec succès');
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    }
}

// Démarrer l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', init);