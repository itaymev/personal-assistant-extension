/// <reference types="chrome"/>

import { useEffect, useState } from "react";

type NotesProps = {
    backToHome: () => void;
}

export default function Notes(props: NotesProps) {

    const [userNotes, setUserNotes] = useState<string[]>([]);
    const [note, setNote] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        loadSavedNotes();
    }, [])

    // load saved notes (on startup and after saving a new note)
    function loadSavedNotes() {
        chrome.storage.sync.get('userNotes', (data) => {
            setUserNotes(data.userNotes ?? []);
        })
    }

    function saveNotes() {
        let notes = userNotes;
        if (notes?.length >= 50) {
            alert('Maximum of 50 notes reached.');
            return;
        }
        if (editIndex !== null) {
            notes[editIndex] = note;
            setEditIndex(null);
        } else {
            notes.push(note);
        }
        chrome.storage.sync.set({ 'userNotes': notes }, () => {
            console.log('Note saved');
            loadSavedNotes();
            setNote('');
        });
    }

    // delete note
    function deleteNote(index: number) {
        chrome.storage.sync.get('userNotes', (data) => {
            let notes = data.userNotes || [];
            notes.splice(index, 1);
            chrome.storage.sync.set({ 'userNotes': notes }, () => {
                console.log('Note deleted');
                loadSavedNotes();
            });
        });
    }

    // edit note
    function editNote(index: number) {
        setEditIndex(index);
    }

    // save edited note
    function saveEditedNote(index: number, newNote: string) {
        let notes = userNotes;
        notes[index] = newNote;
        chrome.storage.sync.set({ 'userNotes': notes }, () => {
            console.log('Note updated');
            loadSavedNotes();
            setEditIndex(null);
        });
    }

    // handle key press
    function handleKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>, index: number) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveEditedNote(index, (event.target as HTMLTextAreaElement).value);
        }
    }

    return (
        <div id="notes-page">
            <h2>Notes</h2>
            <textarea id="note-textarea" placeholder="Type your notes here..." rows={4} cols={30} onChange={(event) => setNote(event.target.value)} value={note}></textarea>
            <br />
            <button id="save-note" onClick={saveNotes}>Save Note</button>
            <div id="saved-notes">
                <ul>
                    {userNotes.map((note, index) => (
                        <li key={index} style={{ position: 'relative' }}>
                            <textarea
                                rows={1}
                                cols={30}
                                value={editIndex === index ? note : userNotes[index]}
                                readOnly={editIndex !== index}
                                onDoubleClick={() => editNote(index)}
                                onBlur={(event) => saveEditedNote(index, (event.target as HTMLTextAreaElement).value)}
                                onKeyPress={(event) => handleKeyPress(event, index)}
                                onChange={(event) => {
                                    if (editIndex === index) {
                                        const updatedNotes = [...userNotes];
                                        updatedNotes[index] = event.target.value;
                                        setUserNotes(updatedNotes);
                                    }
                                }}
                                style={{ resize: 'none' }} // Lock the size of the textarea
                            ></textarea>
                            <button
                                onClick={() => deleteNote(index)}
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    background: 'none',
                                    border: 'none',
                                    color: 'red',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                }}
                            >
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <button id="back-to-home" onClick={props.backToHome}>Back to Home</button>
        </div>
    )
}