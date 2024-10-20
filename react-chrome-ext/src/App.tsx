import React, { useState } from 'react';
import './App.css'; // Assuming you have a CSS file for styling
import ArticleSummarizer from './screens/ArticleSummarizerScreen';

//internal
import Home from './screens/HomeScreen';
import Notes from './screens/NotesScreen';
import Citation from './screens/CitationScreen';

export default function PersonalAssistant() {
  const [view, setView] = useState('home');

  const handleNotesClick = () => {
    setView('notes');
  };

  const handleCitationClick = () => {
    setView('citation');
  };

  const handleSummarizeClick = () => {
    setView('summarize');
  };

  const handleBackToHome = () => {
    setView('home');
  };

  return (
    <div className='main-body'>
      <div className='popup-header'>
        <span className="icon" onClick={handleBackToHome}>&lt;</span>
        <h1>Ed</h1>
        <span className="icon" onClick={() => window.close()}>&times;</span>
      </div>
      <div className='inner-body'>
        {/* Home Page */}
        {view === 'home' && (
          <Home notesNav={handleNotesClick} citationNav={handleCitationClick} summarizeNav={handleSummarizeClick} />
        )}

        {/* Note-taking section */}
        {view === 'notes' && (
          <Notes />
        )}

        {/* Citation section */}
        {view === 'citation' && (
          <Citation />
        )}

        {/* Article Summarizer */}
        {view === 'summarize' && (
          <ArticleSummarizer />
        )}
      </div>
    </div>
  );
}