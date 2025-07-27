// database.js
export async function loadSongs() {
    try {
        const response = await fetch('data/songs.json');
        if (!response.ok) throw new Error('Erreur lors du chargement de songs.json');
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