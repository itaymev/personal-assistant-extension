/// <reference types="chrome"/>

import { useEffect, useState } from "react";

type NotesProps = {
    backToHome: () => void;
}

export default function Notes(props: NotesProps) {

    const [userNotes, setUserNotes] = useState<string[]>([]);
    const [note, setNote] = useState('');

    useEffect(() => {
        loadSavedNotes();
    }, [])

    // load saved notes (on startup and after saving a new note)
    function loadSavedNotes() {
        chrome.storage.sync.get('userNotes', (data) => {
            setUserNotes(data.userNotes);
        })
    }

    function saveNotes() {
        let notes = userNotes;
        if (notes.length >= 50) {
            alert('Maximum of 50 notes reached.');
            return;
        }
        notes.push(note);
        chrome.storage.sync.set({ 'userNotes': notes }, () => {
            console.log('Note saved');
        });

        loadSavedNotes();
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

    return (
        <div id="notes-page">
            <h2>Notes</h2>
            <textarea id="note-textarea" placeholder="Type your notes here..." rows={4} cols={30} onChange={(event) => setNote(event.target.value)} value={note}></textarea>
            <br />
            <button id="save-note" onClick={saveNotes}>Save Note</button>
            <div id="saved-notes"></div>
            <button id="back-to-home" onClick={props.backToHome}>Back to Home</button>
        </div>
    )
}