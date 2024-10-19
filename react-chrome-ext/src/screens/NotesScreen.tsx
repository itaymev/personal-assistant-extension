type NotesProps = {
    backToHome: () => void;
}

export default function Notes(props: NotesProps) {

    return (
        <div id="notes-page">
            <h2>Notes</h2>
            <textarea id="note-textarea" placeholder="Type your notes here..." rows={4} cols={30}></textarea>
            <br />
            <button id="save-note">Save Note</button>
            <div id="saved-notes"></div>
            <button id="back-to-home" onClick={props.backToHome}>Back to Home</button>
        </div>
    )
}