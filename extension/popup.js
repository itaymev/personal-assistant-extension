// popup.js

// home button
document.getElementById('notes-button').addEventListener('click', () => {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('notes-page').classList.remove('hidden');
});

// citation button
document.getElementById('citation-button').addEventListener('click', () => {
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('citation-page').classList.remove('hidden');
});

// back (notes page) button
document.getElementById('back-to-home').addEventListener('click', () => {
    document.getElementById('notes-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
});

// back (citation page) button
document.getElementById('back-to-home-citation').addEventListener('click', () => {
    document.getElementById('citation-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
});

// save note button
document.getElementById('save-note').addEventListener('click', () => {
    const note = document.getElementById('note-textarea').value;
    if (note.trim() === '') return; // Ignore empty notes

    chrome.storage.sync.get('userNotes', (data) => {
        let notes = data.userNotes || [];
        if (notes.length >= 50) {
            alert('Maximum of 50 notes reached.');
            return;
        }
        notes.push(note);
        chrome.storage.sync.set({ 'userNotes': notes }, () => {
            console.log('Note saved');
            document.getElementById('note-textarea').value = ''; // Clear the textarea
            loadSavedNotes();
        });
    });
});

// load saved notes (on startup and after saving a new note)
function loadSavedNotes() {
    chrome.storage.sync.get('userNotes', (data) => {
        const notesContainer = document.getElementById('saved-notes');
        notesContainer.innerHTML = ''; // Clear existing notes
        const notes = data.userNotes || [];
        notes.forEach((note, index) => {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note';
            noteDiv.innerHTML = `
                <textarea rows="4" cols="30" readonly>${note}</textarea>
                <button class="delete-note" data-index="${index}">Delete</button>
            `;
            notesContainer.appendChild(noteDiv);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-note').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                deleteNote(index);
            });
        });
    });
}

// delete note
function deleteNote(index) {
    chrome.storage.sync.get('userNotes', (data) => {
        let notes = data.userNotes || [];
        notes.splice(index, 1);
        chrome.storage.sync.set({ 'userNotes': notes }, () => {
            console.log('Note deleted');
            loadSavedNotes();
        });
    });
}

// load saved notes when extension is opened
document.addEventListener('DOMContentLoaded', loadSavedNotes);

// scan page button
document.getElementById('scan-page').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            files: ['content.js']
        },
        () => {
            chrome.tabs.sendMessage(tab.id, { action: "scanPage" }, (pageDetails) => {
                if (chrome.runtime.lastError) {
                    document.getElementById('citation-result').innerText = `Error: ${chrome.runtime.lastError.message}`;
                    return;
                }

                // Fill the text boxes with the gathered information
                document.getElementById('citation-url').value = pageDetails.url || '';
                document.getElementById('citation-title').value = pageDetails.title || '';
                document.getElementById('citation-author').value = pageDetails.author || '';
                document.getElementById('citation-date').value = pageDetails.publicationDate || '';
                document.getElementById('citation-website').value = pageDetails.websiteName || '';
            });
        }
    );
});

// cite button
document.getElementById('cite-button').addEventListener('click', () => {
    const url = document.getElementById('citation-url').value;
    const title = document.getElementById('citation-title').value;
    const author = document.getElementById('citation-author').value;
    const publicationDate = document.getElementById('citation-date').value;
    const websiteName = document.getElementById('citation-website').value;

    let missingInfo = [];

    if (!author) missingInfo.push('author');
    if (!title) missingInfo.push('title');
    if (!publicationDate) missingInfo.push('publication date');
    if (!websiteName) missingInfo.push('website name');

    if (missingInfo.length > 0) {
        document.getElementById('citation-result').innerText = `Error: Missing information - ${missingInfo.join(', ')}.`;
        return;
    }

    const date = new Date(publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const citation = `${author}. "${title}." ${websiteName}, ${date}, ${url}.`;
    document.getElementById('citation-result').innerText = citation;
});

// save citation textboxes
function saveCitationInputs() {
    const citationInputs = {
        url: document.getElementById('citation-url').value,
        title: document.getElementById('citation-title').value,
        author: document.getElementById('citation-author').value,
        publicationDate: document.getElementById('citation-date').value,
        websiteName: document.getElementById('citation-website').value
    };
    chrome.storage.sync.set({ 'citationInputs': citationInputs }, () => {
        console.log('Citation inputs saved');
    });
}

// load citation textboxes
function loadCitationInputs() {
    chrome.storage.sync.get('citationInputs', (data) => {
        if (data.citationInputs) {
            document.getElementById('citation-url').value = data.citationInputs.url || '';
            document.getElementById('citation-title').value = data.citationInputs.title || '';
            document.getElementById('citation-author').value = data.citationInputs.author || '';
            document.getElementById('citation-date').value = data.citationInputs.publicationDate || '';
            document.getElementById('citation-website').value = data.citationInputs.websiteName || '';
        }
    });
}

// event lisetners for citation textboxes
document.getElementById('citation-url').addEventListener('input', saveCitationInputs);
document.getElementById('citation-title').addEventListener('input', saveCitationInputs);
document.getElementById('citation-author').addEventListener('input', saveCitationInputs);
document.getElementById('citation-date').addEventListener('input', saveCitationInputs);
document.getElementById('citation-website').addEventListener('input', saveCitationInputs);