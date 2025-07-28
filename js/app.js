import { loadSongs } from './database.js';
import { initUpload } from './upload.js';
import { initSearch } from './search.js';
import { initNavigation } from './navigation.js';
import { initFavorites, updateAllFavoriteButtons } from './favorites.js';
import { initPlayer } from './player.js';
import { formatTime } from './utils.js';

// Variable globale pour stocker les chansons
export let songs = [];

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
        
        // Ajouter l'événement de clic pour jouer la chanson
        songCard.addEventListener('click', () => {
            import('./player.js').then(({ playSong }) => {
                playSong(song);
            });
        });
        
        contentGrid.appendChild(songCard);
    });
    
    contentArea.appendChild(contentGrid);
    
    // Mettre à jour les boutons favoris
    updateAllFavoriteButtons();
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