// upload.js
import { formatTime } from './utils.js';

export function initUpload() {
    const uploadBtn = document.querySelector('.upload-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelectorAll('.modal-close');
    const uploadForm = document.querySelector('.upload-form');

    // Afficher la modale
    uploadBtn.addEventListener('click', () => {
        modalOverlay.classList.add('show');
    });

    // Fermer la modale
    modalClose.forEach(btn => {
        btn.addEventListener('click', () => {
            modalOverlay.classList.remove('show');
            uploadForm.reset();
        });
    });

    // Soumettre le formulaire
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mp3Link = document.querySelector('#mp3-link').value;
        const coverLink = document.querySelector('#cover-link').value;
        const title = document.querySelector('#title').value;
        const artist = document.querySelector('#artist').value;
        const album = document.querySelector('#album').value;
        const trackNumber = document.querySelector('#track-number').value || 1;

        if (!mp3Link.includes('drive.google.com/uc?export=download')) {
            alert('Veuillez entrer un lien Google Drive valide pour le MP3.');
            return;
        }

        // Ignorer la récupération de la durée pour le test
        const duration = 0; // Valeur par défaut temporaire
        console.log('Durée définie à 0 pour le test');

        const newSong = {
            id: `song${Date.now()}`,
            title,
            artist,
            album,
            trackNumber: parseInt(trackNumber),
            duration,
            filePath: mp3Link,
            coverPath: coverLink || 'assets/images/default-cover.jpg',
            uploadDate: new Date().toISOString(),
            uploadedBy: 'etudiant'
        };

        console.log('Nouvelle chanson:', newSong);
        alert('Chanson soumise ! L’administrateur l’ajoutera bientôt.');

        uploadForm.reset();
        modalOverlay.classList.remove('show');
    });
}