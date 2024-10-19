//React
import { useState } from "react";

type CitationProps = {
    backToHome: () => void;
}

export default function Citation(props: CitationProps) {

    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [pubDate, setPubDate] = useState('');
    const [name, setName] = useState('');

    function fillAndCite() {
        const pageDetails = {
            url: window.location.href,
            title: document.title || '',
            author: document.querySelector('meta[name="author"]')?.getAttribute('content') ?? '',
            publicationDate: document.querySelector('meta[name="date"]')?.getAttribute('content') ?? '',
            websiteName: document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ?? window.location.hostname
        };
        setUrl(pageDetails.url);
        setTitle(pageDetails.title);
        setAuthor(pageDetails.author);
        setPubDate(pageDetails.publicationDate);
        setName(pageDetails.websiteName);
    }

    return (
        <div id="citation-page" >
            <h2>Citation</h2>
            <div>
                <label>URL:</label>
                <input type="text" value={url} placeholder="URL" />
            </div>
            <div>
                <label>Title:</label>
                <input type="text" value={title} placeholder="Title" />
            </div>
            <div>
                <label>Author:</label>
                <input type="text" value={author} placeholder="Author" />
            </div>
            <div>
                <label>Publication Date:</label>
                <input type="text" value={pubDate} placeholder="Publication Date" />
            </div>
            <div>
                <label>Website Name:</label>
                <input type="text" value={name} placeholder="Website Name" />
            </div>
            <button id="cite-button" onClick={fillAndCite}>Fill and Cite</button>
            <div id="citation-result"></div>
            <button id="back-to-home-citation" onClick={props.backToHome}>Back to Home</button>
        </div>
    )
} 