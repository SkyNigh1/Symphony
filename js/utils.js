// Utilitaires pour l'application Symphony

export function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return '0:00';
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isValidImageUrl(url) {
    return /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);
}

export function isValidAudioUrl(url) {
    return /\.(mp3|wav|ogg|m4a)(\?|$)/i.test(url) || 
           url.includes('drive.google.com') || 
           url.includes('dropbox.com') ||
           url.includes('github.io');
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function sanitizeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}