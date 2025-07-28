const fetch = require('node-fetch');

exports.handler = async function (event) {
  try {
    const { newSong } = JSON.parse(event.body);
    const repo = "skynigh1/Symphony"; // Remplacez par votre dépôt (ex. "username/symphony")
    const path = "data/song.json"; // Chemin du fichier JSON
    const token = process.env.GITHUB_TOKEN; // Token stocké dans les variables d'environnement

    // Récupérer le contenu actuel du fichier JSON
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const fileData = await response.json();
    const currentContent = JSON.parse(Buffer.from(fileData.content, "base64").toString());

    // Ajouter la nouvelle chanson
    currentContent.push(newSong);

    // Mettre à jour le fichier via l'API GitHub
    const updateResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: `Ajout d'une nouvelle chanson: ${newSong.title}`,
        content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString("base64"),
        sha: fileData.sha
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`Erreur lors de la mise à jour: ${updateResponse.status}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Chanson ajoutée avec succès au fichier JSON" })
    };
  } catch (error) {
    console.error('Erreur dans la fonction Netlify:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
