export async function loadSongs() {
    try {
        const response = await fetch('data/song.json');
        if (!response.ok) {
            console.warn('songs.json not found, returning empty array');
            return [];
        }
        const songs = await response.json();
        return songs;
    } catch (error) {
        console.error('Erreur dans loadSongs:', error);
        return [];
    }
}

export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

export function addFavorite(songId) {
    const favorites = getFavorites();
    if (!favorites.includes(songId)) {
        favorites.push(songId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

export function removeFavorite(songId) {
    const favorites = getFavorites().filter(id => id !== songId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}