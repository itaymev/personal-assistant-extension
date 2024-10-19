import React, { useState } from 'react';
import './App.css'; // Assuming you have a CSS file for styling

export default function PersonalAssistant() {
  const [view, setView] = useState('home');

  const handleNotesClick = () => {
    setView('notes');
  };

  const handleCitationClick = () => {
    setView('citation');
  };

  const handleBackToHome = () => {
    setView('home');
  };

  return (
    <div>
      <h1>Personal Assistant</h1>

      {/* Home Page */}
      {view === 'home' && (
        <div id="home-page">
          <button id="notes-button" onClick={handleNotesClick}>Notes</button>
          <button id="citation-button" onClick={handleCitationClick}>Citation</button>
        </div>
      )}

      {/* Note-taking section */}
      {view === 'notes' && (
        <div id="notes-page">
          <h2>Notes</h2>
          <textarea id="note-textarea" placeholder="Type your notes here..." rows={4} cols={30}></textarea>
          <br />
          <button id="save-note">Save Note</button>
          <div id="saved-notes"></div>
          <button id="back-to-home" onClick={handleBackToHome}>Back to Home</button>
        </div>
      )}

      {/* Citation section */}
      {view === 'citation' && (
        <div id="citation-page">
          <h2>Citation</h2>
          <button id="scan-page">Scan Page</button>
          <div>
            <label>URL:</label>
            <input type="text" id="citation-url" placeholder="URL" />
          </div>
          <div>
            <label>Title:</label>
            <input type="text" id="citation-title" placeholder="Title" />
          </div>
          <div>
            <label>Author:</label>
            <input type="text" id="citation-author" placeholder="Author" />
          </div>
          <div>
            <label>Publication Date:</label>
            <input type="text" id="citation-date" placeholder="Publication Date" />
          </div>
          <div>
            <label>Website Name:</label>
            <input type="text" id="citation-website" placeholder="Website Name" />
          </div>
          <button id="cite-button">Cite</button>
          <div id="citation-result"></div>
          <button id="back-to-home-citation" onClick={handleBackToHome}>Back to Home</button>
        </div>
      )}
    </div>
  );
}