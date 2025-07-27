import { songs } from './app.js';
import { getFavorites } from './database.js';
import { playSong } from './player.js';

export function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentGrid = document.querySelector('.content-grid');
    const contentTitle = document.querySelector('.content-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const view = item.querySelector('.nav-link').textContent.trim();
            contentTitle.textContent = view;
            displayView(view);
        });
    });

    function displayView(view) {
        contentGrid.innerHTML = '';

        let filteredSongs = [];
        switch (view) {
            case 'Accueil':
                filteredSongs = songs;
                break;
            case 'Ma Bibliothèque':
                filteredSongs = songs;
                break;
            case 'Favoris':
                const favoriteIds = getFavorites();
                filteredSongs = songs.filter(song => favoriteIds.includes(song.id));
                break;
            case 'Albums':
                // Afficher par albums (groupe par album)
                const albums = [...new Set(songs.map(song => song.album))];
                displayAlbums(albums);
                return;
            case 'Artistes':
                // Afficher par artistes (groupe par artiste)
                const artists = [...new Set(songs.map(song => song.artist))];
                displayArtists(artists);
                return;
        }

        if (filteredSongs.length === 0) {
            contentGrid.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 9l3 3m0 0l3-3m-3 3v6"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    <h3>Aucun contenu disponible</h3>
                    <p>Ajoutez des chansons pour commencer !</p>
                </div>
            `;
            return;
        }

        filteredSongs.forEach(song => {
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

    function displayAlbums(albums) {
        albums.forEach(album => {
            const albumCard = document.createElement('div');
            albumCard.className = 'track-card';
            const firstSong = songs.find(song => song.album === album);
            albumCard.innerHTML = `
                <div class="track-card-cover">
                    <img src="${firstSong.coverPath || 'assets/images/default-cover.jpg'}" alt="${album}">
                    <div class="track-card-overlay">
                        <button class="play-btn-overlay">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="track-card-info">
                    <h3 class="track-card-title">${album}</h3>
                    <p class="track-card-artist">${firstSong.artist}</p>
                </div>
            `;
            albumCard.addEventListener('click', () => {
                contentTitle.textContent = album;
                displayViewByAlbum(album);
            });
            contentGrid.appendChild(albumCard);
        });
    }

    function displayArtists(artists) {
        artists.forEach(artist => {
            const artistCard = document.createElement('div');
            artistCard.className = 'track-card';
            const firstSong = songs.find(song => song.artist === artist);
            artistCard.innerHTML = `
                <div class="track-card-cover">
                    <img src="${firstSong.coverPath || 'assets/images/default-cover.jpg'}" alt="${artist}">
                    <div class="track-card-overlay">
                        <button class="play-btn-overlay">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="track-card-info">
                    <h3 class="track-card-title">${artist}</h3>
                </div>
            `;
            artistCard.addEventListener('click', () => {
                contentTitle.textContent = artist;
                displayViewByArtist(artist);
            });
            contentGrid.appendChild(artistCard);
        });
    }

    function displayViewByAlbum(album) {
        const filteredSongs = songs.filter(song => song.album === album);
        displayView('Albums');
        contentGrid.innerHTML = '';
        filteredSongs.forEach(song => {
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
                </div>
            `;
            songCard.addEventListener('click', () => playSong(song));
            contentGrid.appendChild(songCard);
        });
    }

    function displayViewByArtist(artist) {
        const filteredSongs = songs.filter(song => song.artist === artist);
        displayView('Artistes');
        contentGrid.innerHTML = '';
        filteredSongs.forEach(song => {
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
                    <p class="track-card-album">${song.album}</p>
                </div>
            `;
            songCard.addEventListener('click', () => playSong(song));
            contentGrid.appendChild(songCard);
        });
    }
}