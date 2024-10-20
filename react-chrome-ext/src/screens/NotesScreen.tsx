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
        setEditIndex(prev => {
            if (prev === index) {
                return null;
            }
            return index
        });
        setNote(userNotes[index]);
    }

    // save edited note
    function saveEditedNote(index: number, newNote: string) {
        let notes = userNotes;
        if (newNote !== '') {
            notes[index] = newNote;
        }
        chrome.storage.sync.set({ 'userNotes': notes }, () => {
            console.log('Note updated');
            loadSavedNotes();
            setEditIndex(null);
        });
    }

    // handle key press
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
            <textarea id="note-textarea" placeholder="Type your notes here..." rows={4} cols={30} onKeyDown={handleKeyPress} onChange={(event) => setNote(event.target.value)} value={note}></textarea>
            <div id="note-header">
                <h2 id="note-h2">Notes</h2>
                <button id="save-note" onClick={saveNotes}>{editIndex !== null ? 'Edit Note' : 'Save Note'}</button>
            </div>
            <div id="saved-notes">
                <ul id="note-ul">
                    {userNotes.map((note, index) => (
                        <li id="note-list-item" key={index} style={{ position: 'relative', backgroundColor: editIndex === index ? 'var(--hover-color)' : undefined }}>
                            <div style={{ display: "flex", flexDirection: 'row' }}>

                                <span
                                    id="note-list-item-text"
                                    onClick={() => editNote(index)}
                                    // onBlur={(event) => saveEditedNote(index, (event.target as HTMLTextAreaElement).value)}
                                    // onKeyPress={(event) => handleKeyPress(event, index)}
                                    // onChange={(event) => {
                                    //     if (editIndex === index) {
                                    //         const updatedNotes = [...userNotes];
                                    //         updatedNotes[index] = event.target.value;
                                    //         setUserNotes(updatedNotes);
                                    //     }
                                    // }}
                                    style={{ resize: 'none' }} // Lock the size of the textarea
                                >{editIndex === index ? note : userNotes[index]}</span>
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
    )
}