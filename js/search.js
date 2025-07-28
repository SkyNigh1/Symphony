import { songs } from './app.js';
import { playSong } from './player.js';

export function initSearch() {
    const searchBar = document.querySelector('.search-bar');
    const contentArea = document.querySelector('.content-area');

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase().trim();
        const filteredSongs = songs.filter(song => 
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query) ||
            song.album.toLowerCase().includes(query)
        );
        displaySearchResults(filteredSongs);
    });

    function displaySearchResults(results) {
        if (!contentArea) {
            console.error('Error: .content-area element not found in the DOM');
            return;
        }
        const emptyState = contentArea.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
        const existingGrid = contentArea.querySelector('.content-grid');
        if (existingGrid) {
            existingGrid.remove();
        }

        if (results.length === 0) {
            contentArea.innerHTML += `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 9l6 6m0-6l-6 6"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez un autre terme de recherche.</p>
                </div>
            `;
            return;
        }

        const songContainer = document.createElement('div');
        songContainer.className = 'content-grid';
        results.forEach(song => {
            const songCard = document.createElement('div');
            songCard.className = 'track-card';
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
            songCard.addEventListener('click', () => playSong(song));
            songContainer.appendChild(songCard);
        });
        contentArea.appendChild(songContainer);
    }
}