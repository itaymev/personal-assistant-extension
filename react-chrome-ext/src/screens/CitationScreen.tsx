type CitationProps = {
    backToHome: () => void;
}

export default function Citation(props: CitationProps) {
    return (
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
            <button id="back-to-home-citation" onClick={props.backToHome}>Back to Home</button>
        </div>
    )
} 