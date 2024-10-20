/// <reference types="chrome"/>

import { useEffect, useState } from "react";
import '../App.css';

type NotesProps = {
    backToHome?: () => void;
}

export default function Notes(props: NotesProps) {
    const [userNotes, setUserNotes] = useState<string[]>([]);
    const [note, setNote] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [currentUrl, setCurrentUrl] = useState<string>('');

    useEffect(() => {
        getCurrentTabUrl().then((url) => {
            setCurrentUrl(url || '');
            loadSavedNotes(url || '');
        });
    }, []);

    // Retrieve the current tab URL
    const getCurrentTabUrl = async (): Promise<string | undefined> => {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            return tabs[0].url;
        } catch (error) {
            console.error("Error getting current tab URL:", error);
            return undefined;
        }
    };

    // Load saved notes for the current URL
    function loadSavedNotes(url: string) {
        chrome.storage.sync.get(url, (data) => {
            setUserNotes(data[url] ?? []);
        });
    }

    // Save notes for the current URL
    function saveNotes() {
        let notes = [...userNotes];
        if (notes?.length >= 50) {
            alert('Maximum of 50 notes reached.');
            return;
        }
        if (editIndex !== null) {
            notes[editIndex] = note;
            setEditIndex(null);
        } else {
            notes = [note, ...notes];
            if (note === '') {
                return;
            }
        }
        chrome.storage.sync.set({ [currentUrl]: notes }, () => {
            console.log('Note saved for URL:', currentUrl);
            loadSavedNotes(currentUrl);
            setNote('');
        });
    }

    // Delete note for the current URL
    function deleteNote(index: number) {
        let notes = [...userNotes];
        notes.splice(index, 1);
        chrome.storage.sync.set({ [currentUrl]: notes }, () => {
            console.log('Note deleted for URL:', currentUrl);
            loadSavedNotes(currentUrl);
        });
    }

    // Edit note
    function editNote(index: number) {
        setEditIndex(prev => (prev === index ? null : index));
        setNote(userNotes[index]);
    }

    // Save edited note
    function saveEditedNote(index: number, newNote: string) {
        let notes = [...userNotes];
        if (newNote !== '') {
            notes[index] = newNote;
        }
        chrome.storage.sync.set({ [currentUrl]: notes }, () => {
            console.log('Note updated for URL:', currentUrl);
            loadSavedNotes(currentUrl);
            setEditIndex(null);
        });
    }

    // Handle key press
    function handleKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>, index?: number) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (index === undefined) {
                saveNotes();
            } else {
                saveEditedNote(index, (event.target as HTMLTextAreaElement).value);
            }
        }
    }

    return (
        <div id="notes-page">
            <textarea 
                id="note-textarea" 
                placeholder="Type your notes here..." 
                rows={4} 
                cols={30} 
                onKeyDown={handleKeyPress} 
                onChange={(event) => setNote(event.target.value)} 
                value={note}
            ></textarea>
            <div id="note-header">
                <h2 id="note-h2">Notes for: {currentUrl}</h2>
                <button id="save-note" onClick={saveNotes}>
                    {editIndex !== null ? 'Edit Note' : 'Save Note'}
                </button>
            </div>
            <div id="saved-notes">
                <ul id="note-ul">
                    {userNotes.map((note, index) => (
                        <li 
                            id="note-list-item" 
                            key={index} 
                            style={{ position: 'relative', backgroundColor: editIndex === index ? 'var(--hover-color)' : undefined }}
                        >
                            <div style={{ display: "flex", flexDirection: 'row' }}>
                                <span
                                    id="note-list-item-text"
                                    onClick={() => editNote(index)}
                                    style={{ resize: 'none' }}
                                >
                                    {editIndex === index ? note : userNotes[index]}
                                </span>
                                <button
                                    onClick={() => deleteNote(index)}
                                    id="note-x"
                                >
                                    x
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
