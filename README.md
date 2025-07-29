Symphony - Music Player Web Application
Overview
Symphony is a web-based music player application developed as an educational exercise to demonstrate front-end development skills using HTML, CSS, and JavaScript. This project simulates a music streaming interface with features such as song playback, queue management, and a favorites system. It is strictly a non-commercial, personal project created for learning purposes and is not intended for public distribution or commercial use.
Purpose
The primary goal of Symphony is to serve as a portfolio piece to showcase proficiency in web development technologies, including:

HTML5 for structuring the application.
CSS3 for responsive design and dynamic styling (e.g., color extraction from album covers).
JavaScript (ES6+) for dynamic functionality, including audio playback, queue management, and local storage for favorites.
Modular JavaScript with dynamic imports to manage dependencies efficiently.

This project is an academic exercise and is not affiliated with any commercial music streaming service.
Features

Music Playback: Play, pause, skip, and navigate through a list of songs with a progress bar and volume controls.
Queue Management: Displays a dynamic queue of upcoming songs in the "Up Next" section, with clickable items to play songs directly.
Favorites System: Allows users to mark songs as favorites, stored locally in the browser's localStorage.
Dynamic Styling: Extracts harmonious colors from album covers to create a visually appealing gradient background.
Responsive Design: Adapts to various screen sizes, with some features (e.g., queue visibility) optimized for desktop.

Disclaimer: Use of Copyrighted Material
This project is a development exercise and may include sample music files or references to music for demonstration purposes only. No copyrighted material is distributed with this project, and any music files used during development are either:

Placeholder files created by the developer for testing purposes.
Sample audio files sourced from public domain or royalty-free libraries.
References to music files that are not included in the repository.

If any copyrighted music is referenced in the project (e.g., in the song.json file or during testing), it is used solely for educational purposes to simulate a realistic music player interface. The developer does not claim any ownership or rights over copyrighted material, and such material is not intended to be distributed, shared, or used commercially.
Important: Users of this project are responsible for ensuring that any music files added to the application comply with applicable copyright laws. The developer assumes no liability for the misuse of copyrighted content by others.
Installation

Clone the repository:git clone https://github.com/your-username/symphony.git


Navigate to the project directory:cd symphony


Open index.html in a web browser to run the application locally. No server is required, as the application runs entirely client-side.

Usage

Adding Songs: Populate the song.json file or modify the songs array in app.js with song metadata (title, artist, filePath, coverPath). Ensure that any audio files used are legally sourced.
Playing Songs: Click on a song card in the "Home" or "Library" view to start playback.
Managing Favorites: Click the heart icon on song cards or in the queue to add/remove songs from favorites.
Queue Navigation: View and interact with the "Up Next" queue in the player to select upcoming songs.

Project Structure

index.html: Main HTML file for the application.
player.html: Template for the music player interface.
css/
styles.css: Global styles for the application.
player.css: Styles specific to the music player and queue.


js/
app.js: Main application logic and song data.
player.js: Handles audio playback, queue management, and color extraction.
favorites.js: Manages the favorites system using localStorage.
database.js: Utility functions for storing and retrieving data.
utils.js: Helper functions (e.g., time formatting).


assets/: Contains images (e.g., default cover art) and sample audio files (if applicable).
song.json: Sample song metadata for testing.

Technologies Used

HTML5: For structuring the application.
CSS3: For styling, including dynamic gradients and responsive design.
JavaScript (ES6+): For interactivity and dynamic updates.
LocalStorage: For persisting favorites data.
Web Audio API: For audio playback and control.

Limitations

The application is designed for desktop use, with the queue section hidden on mobile devices (screen width < 968px) by default.
No backend or server-side functionality is included; all data is stored client-side.
The project does not support advanced features like playlists or streaming from external APIs, as it is focused on front-end development.

Future Improvements

Add support for playlists to group songs.
Implement a shuffle and repeat mode for the queue.
Enhance mobile responsiveness to display the queue on smaller screens.
Integrate a mock API for simulated streaming functionality.

Legal Notice
This project is provided "as is" for educational purposes only. The developer makes no representations or warranties regarding the use of any copyrighted material. Users must ensure compliance with copyright laws when adding music files to the application. The developer is not responsible for any legal issues arising from the misuse of this project.
Contact
For questions or feedback, please contact [your-name] at [your-email]. This project is open to contributions for educational purposes, but please respect the non-commercial nature of the project.
