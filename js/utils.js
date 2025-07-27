export function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function validateGoogleDriveLink(link) {
    const regex = /https:\/\/drive\.google\.com\/uc\?export=download&id=[\w-]+/;
    return regex.test(link);
}