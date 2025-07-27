import { songs } from './app.js';
import { playSong } from './player.js';

export function initSearch() {
    const searchBar = document.querySelector('.search-bar');
    const contentGrid = document.querySelector('.content-grid');

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
        contentGrid.innerHTML = '';

        if (results.length === 0) {
            contentGrid.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 9l3 3m0 0l3-3m-3 3v6"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez un autre terme de recherche.</p>
                </div>
            `;
            return;
        }

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
            contentGrid.appendChild(songCard);
        });
    }
}