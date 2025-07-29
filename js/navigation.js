import { songs } from './app.js';
import { getFavorites, addFavorite, removeFavorite } from './database.js';
import { playSong } from './player.js';

export function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
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
}

function displayView(view) {
    const contentGrid = document.querySelector('.content-grid');
    if (!contentGrid) {
        console.error('Error: .content-grid element not found in the DOM for view:', view);
        return;
    }
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
            const albums = [...new Set(songs.map(song => song.album))];
            displayAlbums(albums);
            return;
        case 'Artistes':
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
        const songCard = createSongCard(song, true); // true pour afficher le bouton favori
        contentGrid.appendChild(songCard);
    });
}

function displayAlbums(albums) {
    const contentGrid = document.querySelector('.content-grid');
    if (!contentGrid) {
        console.error('Error: .content-grid element not found in the DOM for albums');
        return;
    }
    contentGrid.innerHTML = '';

    albums.forEach(album => {
        const albumCard = document.createElement('div');
        albumCard.className = 'track-card';
        const firstSong = songs.find(song => song.album === album);
        const albumSongs = songs.filter(song => song.album === album);
        
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
            <div class="track-card-actions">
                <button class="favorite-btn album-favorite" data-album="${album}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                </button>
            </div>
            <div class="track-card-info">
                <h3 class="track-card-title">${album}</h3>
                <p class="track-card-artist">${firstSong.artist}</p>
                <p class="track-card-album">${albumSongs.length} morceaux</p>
            </div>
        `;
        
        // Gérer le clic sur l'album pour afficher ses chansons
        albumCard.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                const contentTitle = document.querySelector('.content-title');
                contentTitle.textContent = album;
                displayAlbumDetails(album);
            }
        });
        
        // Gérer le favori pour l'album (ajouter/retirer tous les morceaux)
        const favoriteBtn = albumCard.querySelector('.album-favorite');
        updateAlbumFavoriteButton(favoriteBtn, album);
        
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleAlbumFavorite(album);
            updateAlbumFavoriteButton(favoriteBtn, album);
        });
        
        contentGrid.appendChild(albumCard);
    });
}

function displayArtists(artists) {
    const contentGrid = document.querySelector('.content-grid');
    if (!contentGrid) {
        console.error('Error: .content-grid element not found in the DOM for artists');
        return;
    }
    contentGrid.innerHTML = '';

    artists.forEach(artist => {
        const artistCard = document.createElement('div');
        artistCard.className = 'track-card';
        const firstSong = songs.find(song => song.artist === artist);
        const artistSongs = songs.filter(song => song.artist === artist);
        
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
                <p class="track-card-album">${artistSongs.length} morceaux</p>
            </div>
        `;
        
        artistCard.addEventListener('click', () => {
            const contentTitle = document.querySelector('.content-title');
            contentTitle.textContent = artist;
            displayViewByArtist(artist);
        });
        
        contentGrid.appendChild(artistCard);
    });
}

function displayAlbumDetails(album) {
    const contentArea = document.querySelector('.content-area');
    const albumSongs = songs.filter(song => song.album === album)
        .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));
    
    if (albumSongs.length === 0) return;
    
    const firstSong = albumSongs[0];
    
    // Calculer la durée totale
    const totalDuration = albumSongs.reduce((total, song) => {
        // Supposons que chaque chanson a une durée en secondes
        return total + (song.duration || 180); // 3 minutes par défaut si pas de durée
    }, 0);
    
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        }
        return `${minutes}min`;
    };
    
    const formatTrackDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Créer le HTML pour la vue détaillée
    contentArea.innerHTML = `
        <div class="album-detail-view">
            <div class="album-header">
                <div class="album-info">
                    <h1 class="album-title">${album}</h1>
                    <p class="album-artist">${firstSong.artist}</p>
                    <div class="album-meta">
                        <span class="album-track-count">${albumSongs.length} morceaux</span>
                        <span class="album-duration">${formatDuration(totalDuration)}</span>
                    </div>
                </div>
                <div class="album-cover-large">
                    <img src="${firstSong.coverPath || 'assets/images/default-cover.jpg'}" alt="${album}">
                </div>
            </div>
            
            <div class="album-tracks">
                <div class="tracks-list">
                    ${albumSongs.map((song, index) => `
                        <div class="track-row" data-song-id="${song.id}">
                            <div class="track-number">
                                <span class="number">${song.trackNumber || index + 1}</span>
                                <button class="play-btn-track">
                                    <svg class="play-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z"></path>
                                    </svg>
                                    <svg class="pause-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="track-name">${song.title}</div>
                            <div class="track-duration">${formatTrackDuration(song.duration || 180)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Ajouter les événements pour les tracks
    const trackRows = contentArea.querySelectorAll('.track-row');
    trackRows.forEach(row => {
        const songId = row.dataset.songId;
        const song = songs.find(s => s.id === songId);
        
        row.addEventListener('click', () => {
            playSong(song);
        });
        
        row.addEventListener('mouseenter', () => {
            row.classList.add('hover');
        });
        
        row.addEventListener('mouseleave', () => {
            row.classList.remove('hover');
        });
    });
}

function displayViewByAlbum(album) {
    const contentGrid = document.querySelector('.content-grid');
    if (!contentGrid) {
        console.error('Error: .content-grid element not found in the DOM for album:', album);
        return;
    }
    const filteredSongs = songs.filter(song => song.album === album);
    contentGrid.innerHTML = '';
    filteredSongs.forEach(song => {
        const songCard = createSongCard(song, true); // true pour afficher le bouton favori
        contentGrid.appendChild(songCard);
    });
}

function displayViewByArtist(artist) {
    const contentGrid = document.querySelector('.content-grid');
    if (!contentGrid) {
        console.error('Error: .content-grid element not found in the DOM for artist:', artist);
        return;
    }
    const filteredSongs = songs.filter(song => song.artist === artist);
    contentGrid.innerHTML = '';
    filteredSongs.forEach(song => {
        const songCard = createSongCard(song, true); // true pour afficher le bouton favori
        contentGrid.appendChild(songCard);
    });
}

// Fonction utilitaire pour créer une carte de chanson avec bouton favori
function createSongCard(song, showFavoriteBtn = false) {
    const songCard = document.createElement('div');
    songCard.className = 'track-card';
    songCard.dataset.songId = song.id;
    
    const favoriteBtn = showFavoriteBtn ? `
        <div class="track-card-actions">
            <button class="favorite-btn song-favorite" data-song-id="${song.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
            </button>
        </div>
    ` : '';
    
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
        ${favoriteBtn}
        <div class="track-card-info">
            <h3 class="track-card-title">${song.title}</h3>
            <p class="track-card-artist">${song.artist}</p>
            <p class="track-card-album">${song.album}</p>
        </div>
    `;
    
    // Gérer le clic sur la chanson pour la jouer
    songCard.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-btn')) {
            playSong(song);
        }
    });
    
    // Gérer le bouton favori si présent
    if (showFavoriteBtn) {
        const favoriteBtn = songCard.querySelector('.song-favorite');
        updateSongFavoriteButton(favoriteBtn, song.id);
        
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSongFavorite(song.id);
            updateSongFavoriteButton(favoriteBtn, song.id);
        });
    }
    
    return songCard;
}

// Fonctions pour gérer les favoris
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

function updateSongFavoriteButton(button, songId) {
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

function updateAlbumFavoriteButton(button, album) {
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