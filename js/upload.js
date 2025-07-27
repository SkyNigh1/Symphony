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
        console.log('Formulaire soumis');

        const mp3Link = document.querySelector('#mp3-link').value;
        const coverLink = document.querySelector('#cover-link').value;
        const title = document.querySelector('#title').value;
        const artist = document.querySelector('#artist').value;
        const album = document.querySelector('#album').value;
        const trackNumber = document.querySelector('#track-number').value || 1;

        // Validation des liens MP3
        const isValidGoogleDrive = mp3Link.includes('drive.google.com/uc?export=download');
        const isValidGitHub = mp3Link.includes('github.io');
        const isValidDropbox = mp3Link.includes('dropbox.com') && mp3Link.includes('?dl=1');
        
        if (!isValidGoogleDrive && !isValidGitHub && !isValidDropbox) {
            console.log('Validation échouée: Lien MP3 invalide');
            alert('Veuillez entrer un lien Google Drive, GitHub ou Dropbox valide pour le MP3.');
            return;
        }

        // Validation du lien de couverture (optionnel)
        let coverPath = coverLink || 'assets/images/default-cover.jpg';
        if (coverLink) {
            const isValidCoverGoogleDrive = coverLink.includes('drive.google.com/uc?export=download');
            const isValidCoverGitHub = coverLink.includes('github.io');
            const isValidCoverDropbox = coverLink.includes('dropbox.com') && coverLink.includes('?dl=1');
            if (!isValidCoverGoogleDrive && !isValidCoverGitHub && !isValidCoverDropbox) {
                console.log('Validation échouée: Lien de couverture invalide, utilisation de l’image par défaut');
                coverPath = 'assets/images/default-cover.jpg';
            }
        }

        // Calculer la durée du MP3
        let duration = 0;
        try {
            console.log('Tentative de chargement du MP3:', mp3Link);
            const audio = new Audio(mp3Link);
            await new Promise((resolve, reject) => {
                audio.addEventListener('loadedmetadata', () => {
                    duration = Math.floor(audio.duration);
                    console.log('Durée du MP3:', duration);
                    resolve();
                });
                audio.addEventListener('error', (e) => {
                    console.error('Erreur de chargement MP3:', e.target.error);
                    reject(`Erreur lors du chargement du MP3: ${e.target.error.message}`);
                });
            });
        } catch (error) {
            console.error('Erreur catchée:', error);
            alert('Impossible de charger le MP3. Vérifiez le lien ou essayez un autre service.');
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
            coverPath,
            uploadDate: new Date().toISOString(),
            uploadedBy: 'etudiant' // À remplacer par un identifiant utilisateur
        };

        console.log('Nouvelle chanson:', newSong);
        alert('Chanson soumise ! L’administrateur l’ajoutera bientôt.');

        // Réinitialiser le formulaire et fermer la modale
        uploadForm.reset();
        modalOverlay.classList.remove('show');
    });
}   