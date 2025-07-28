function displayView(view) {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) {
        console.error('Error: .content-area element not found in the DOM for view:', view);
        return;
    }
    // Clear only the content below content-header
    const emptyState = contentArea.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    const existingGrid = contentArea.querySelector('.content-grid');
    if (existingGrid) {
        existingGrid.remove();
    }

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
        contentArea.innerHTML += `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 9l6 6m0-6l-6 6"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <h3>Aucun contenu disponible</h3>
                <p>Ajoutez des chansons pour commencer !</p>
            </div>
        `;
        return;
    }

    const songContainer = document.createElement('div');
    songContainer.className = 'content-grid';
    filteredSongs.forEach(song => {
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
        songCard.addEventListener('click', () => playSong(song));
        songContainer.appendChild(songCard);
    });
    contentArea.appendChild(songContainer);
}

function displayAlbums(albums) {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) {
        console.error('Error: .content-area element not found in the DOM for albums');
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

    const albumContainer = document.createElement('div');
    albumContainer.className = 'content-grid';
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
        albumContainer.appendChild(albumCard);
    });
    contentArea.appendChild(albumContainer);
}

function displayArtists(artists) {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) {
        console.error('Error: .content-area element not found in the DOM for artists');
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

    const artistContainer = document.createElement('div');
    artistContainer.className = 'content-grid';
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
        artistContainer.appendChild(artistCard);
    });
    contentArea.appendChild(artistContainer);
}

function displayViewByAlbum(album) {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) {
        console.error('Error: .content-area element not found in the DOM for album:', album);
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

    const filteredSongs = songs.filter(song => song.album === album);
    const songContainer = document.createElement('div');
    songContainer.className = 'content-grid';
    filteredSongs.forEach(song => {
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
            </div>
        `;
        songCard.addEventListener('click', () => playSong(song));
        songContainer.appendChild(songCard);
    });
    contentArea.appendChild(songContainer);
}

function displayViewByArtist(artist) {
    const contentArea = document.querySelector('.content-area');
    if (!contentArea) {
        console.error('Error: .content-area element not found in the DOM for artist:', artist);
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

    const filteredSongs = songs.filter(song => song.artist === artist);
    const songContainer = document.createElement('div');
    songContainer.className = 'content-grid';
    filteredSongs.forEach(song => {
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
                <p class="track-card-album">${song.album}</p>
            </div>
        `;
        songCard.addEventListener('click', () => playSong(song));
        songContainer.appendChild(songCard);
    });
    contentArea.appendChild(songContainer);
}