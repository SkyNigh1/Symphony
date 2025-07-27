import { songs } from './app.js';
import { addFavorite, removeFavorite, getFavorites } from './database.js';
import { playSong } from './player.js';

export function initFavorites() {
    // Ajouter des boutons de favoris sur chaque carte
    document.addEventListener('click', (e) => {
        if (e.target.closest('.track-card')) {
            const card = e.target.closest('.track-card');
            const songId = card.dataset.songId; // Suppose que l’ID est ajouté dynamiquement
            if (!songId) return;

            const isFavorite = getFavorites().includes(songId);
            if (isFavorite) {
                removeFavorite(songId);
                updateFavoriteButton(card, false);
            } else {
                addFavorite(songId);
                updateFavoriteButton(card, true);
            }
        }
    });

    // Mettre à jour l’affichage des favoris
    document.addEventListener('DOMContentLoaded', () => {
        updateAllFavoriteButtons();
    });
}

function updateFavoriteButton(card, isFavorite) {
    const button = card.querySelector('.favorite-btn') || document.createElement('button');
    button.className = `favorite-btn ${isFavorite ? 'active' : ''}`;
    button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
        </svg>
    `;
    if (!card.querySelector('.favorite-btn')) {
        card.querySelector('.track-card-info').appendChild(button);
    }
}

function updateAllFavoriteButtons() {
    const cards = document.querySelectorAll('.track-card');
    cards.forEach(card => {
        const songId = card.dataset.songId;
        if (songId) {
            const isFavorite = getFavorites().includes(songId);
            updateFavoriteButton(card, isFavorite);
        }
    });
}

// Modifier app.js pour ajouter dataset.songId
document.addEventListener('DOMContentLoaded', () => {
    const contentGrid = document.querySelector('.content-grid');
    contentGrid.addEventListener('DOMSubtreeModified', () => {
        updateAllFavoriteButtons();
    });
});