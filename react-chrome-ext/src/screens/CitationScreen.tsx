//React
import { useEffect, useState } from "react";

type CitationProps = {
    backToHome: () => void;
}

export default function Citation(props: CitationProps) {

    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [pubDate, setPubDate] = useState('');
    const [name, setName] = useState('');
    const [citation, setCitation] = useState('');

    useEffect(() => {
        const getCurrentTabUrl = async () => {
            try {
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tabs.length > 0) {
                    setUrl(tabs[0].url || '');
                }
            } catch (error) {
                console.error("Error getting current tab UtRL:", error);
            }
        };

        getCurrentTabUrl()
    }, [])

    async function fillAndCite() {
        try {
            
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0) {
                setUrl(tabs[0].url || '');
            }

            chrome.tabs.sendMessage(tabs[0].id!, { action: "getPageDetails" }, (response) => {
                if (response) {
                    //setPageDetails(response.pageDetails);
                    setUrl(response.pageDetails.url);
                    setTitle(response.pageDetails.title);
                    setAuthor(response.pageDetails.author);
                    setPubDate(response.pageDetails.publicationDate);
                    setName(response.pageDetails.websiteName);
                    generateCitation(response.pageDetails);
                } else {
                    console.error("No response from content script.");
                }
            });

        } catch (error) {
            console.log(error);
        }
    }

    function generateCitation(pageDetails: any) {
        const { url, title, author, publicationDate, websiteName } = pageDetails;
        const citation = `${author}. "${title}." ${websiteName}, ${publicationDate}, ${url}.`;
        setCitation(citation);
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
            <div id="citation-result">{citation}</div>
            <button id="back-to-home-citation" onClick={props.backToHome}>Back to Home</button>
        </div>
    )
} 