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

        // Validation des liens
        if (!mp3Link.includes('drive.google.com/uc?export=download')) {
            alert('Veuillez entrer un lien Google Drive valide pour le MP3.');
            return;
        }

        // Calculer la durée du MP3
        let duration = 0;
        try {
            const audio = new Audio(mp3Link);
            await new Promise((resolve, reject) => {
                audio.addEventListener('loadedmetadata', () => {
                    duration = Math.floor(audio.duration);
                    resolve();
                });
                audio.addEventListener('error', () => reject('Erreur lors du chargement du MP3'));
            });
        } catch (error) {
            console.error(error);
            alert('Impossible de charger le MP3. Vérifiez le lien.');
            return;
        }

        // Créer l’objet chanson
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
            uploadedBy: 'etudiant' // À remplacer par un identifiant utilisateur
        };

        // Pour un projet étudiant, afficher les données pour mise à jour manuelle
        console.log('Nouvelle chanson:', newSong);
        alert('Chanson soumise ! L’administrateur l’ajoutera bientôt.');

        // Optionnel : Intégrer un Google Form
        // window.location.href = `https://forms.gle/xxx?entry.1=${encodeURIComponent(JSON.stringify(newSong))}`;

        // Réinitialiser le formulaire et fermer la modale
        uploadForm.reset();
        modalOverlay.classList.remove('show');
    });
}