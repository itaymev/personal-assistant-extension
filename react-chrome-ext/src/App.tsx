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
    <div>
      <h1>Ed</h1>

      {/* Home Page */}
      {view === 'home' && (
        <Home notesNav={handleNotesClick} citationNav={handleCitationClick} summarizeNav={handleSummarizeClick} />
      )}

      {/* Note-taking section */}
      {view === 'notes' && (
        <Notes backToHome={handleBackToHome} />
      )}

      {/* Citation section */}
      {view === 'citation' && (
        <Citation backToHome={handleBackToHome} />
      )}

      {/* Article Summarizer */}
      {view === 'summarize' && (
        <ArticleSummarizer backToHome={handleBackToHome} />
      )}
    </div>
  );
}