import { formatTime } from './utils.js';
import { songs, displayRecentSongs } from './app.js';

export function initUpload() {
    const uploadBtn = document.querySelector('.upload-btn');
    const modalOverlay = document.querySelector('#upload-modal');
    const modalClose = document.querySelectorAll('.modal-close');
    const uploadForm = document.querySelector('.upload-form');

    if (!uploadBtn || !modalOverlay || !uploadForm) {
        console.error('Éléments de l\'upload manquants');
        return;
    }

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

    // Fermer la modale en cliquant sur l'overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('show');
            uploadForm.reset();
        }
    });

    // Soumettre le formulaire
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulaire soumis');

        const mp3Link = document.querySelector('#mp3-link').value.trim();
        const coverLink = document.querySelector('#cover-link').value.trim();
        const title = document.querySelector('#track-title').value.trim();
        const artist = document.querySelector('#track-artist').value.trim();
        const album = document.querySelector('#track-album').value.trim();
        const trackNumber = document.querySelector('#track-number').value || 1;

        // Validation des champs requis
        if (!mp3Link || !title || !artist || !album) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Validation des liens MP3
        const isValidGoogleDrive = mp3Link.includes('drive.google.com/uc?export=download');
        const isValidGitHub = mp3Link.includes('github.io');
        const isValidDropbox = mp3Link.includes('dropbox.com') && mp3Link.includes('?dl=1');
        const isValidDirect = mp3Link.endsWith('.mp3') || mp3Link.includes('.mp3?');
        
        if (!isValidGoogleDrive && !isValidGitHub && !isValidDropbox && !isValidDirect) {
            console.log('Validation échouée: Lien MP3 invalide');
            alert('Veuillez entrer un lien valide pour le MP3 (Google Drive, GitHub, Dropbox ou lien direct).');
            return;
        }

        // Validation du lien de couverture (optionnel)
        let coverPath = 'assets/images/default-cover.jpg';
        if (coverLink) {
            const isValidCoverGoogleDrive = coverLink.includes('drive.google.com/uc?export=download');
            const isValidCoverGitHub = coverLink.includes('github.io');
            const isValidCoverDropbox = coverLink.includes('dropbox.com') && coverLink.includes('?dl=1');
            const isValidDirectImage = /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(coverLink);
            
            if (isValidCoverGoogleDrive || isValidCoverGitHub || isValidCoverDropbox || isValidDirectImage) {
                coverPath = coverLink;
            } else {
                console.log('Lien de couverture invalide, utilisation de l\'image par défaut');
            }
        }

        // Afficher un indicateur de chargement
        const submitBtn = uploadForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Ajout en cours...';
        submitBtn.disabled = true;

        // Calculer la durée du MP3
        let duration = 0;
        try {
            console.log('Tentative de chargement du MP3:', mp3Link);
            const audio = new Audio();
            
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Timeout lors du chargement'));
                }, 10000); // 10 secondes timeout
                
                audio.addEventListener('loadedmetadata', () => {
                    clearTimeout(timeout);
                    duration = Math.floor(audio.duration) || 0;
                    console.log('Durée du MP3:', duration);
                    resolve();
                });
                
                audio.addEventListener('error', (e) => {
                    clearTimeout(timeout);
                    console.error('Erreur de chargement MP3:', e);
                    reject(new Error('Impossible de charger le fichier MP3'));
                });
                
                audio.src = mp3Link;
            });
        } catch (error) {
            console.error('Erreur lors du chargement de la durée:', error);
            // Continuer sans la durée si elle ne peut pas être chargée
            duration = 0;
        }

        // Créer l'objet chanson
        const newSong = {
            id: `song_${Date.now()}`,
            title,
            artist,
            album,
            trackNumber: parseInt(trackNumber),
            duration,
            filePath: mp3Link,
            coverPath,
            uploadDate: new Date().toISOString(),
            uploadedBy: 'user'
        };

        // Envoyer la chanson à la fonction Netlify
        try {
            console.log('Envoi des données à Netlify:', newSong);
            
            const response = await fetch('https://peaceful-llama-d73d5f.netlify.app/.netlify/functions/update-songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newSong })
            });

            console.log('Réponse reçue, status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erreur de réponse:', errorText);
                throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Résultat:', result);

            // Ajouter la chanson à la liste locale pour un affichage immédiat
            songs.push(newSong);
            console.log('Nouvelle chanson ajoutée:', newSong);

            // Rafraîchir l'affichage
            displayRecentSongs(songs);

            // Restaurer le bouton
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            alert('Chanson ajoutée avec succès !');

            // Réinitialiser le formulaire et fermer la modale
            uploadForm.reset();
            modalOverlay.classList.remove('show');

        } catch (error) {
            console.error('Erreur lors de l\'envoi à Netlify:', error);
            alert('Erreur lors de l\'ajout de la chanson: ' + error.message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}