//React
import { useEffect, useState } from "react";

type CitationProps = {
    backToHome?: () => void;
}

interface PageDetails {
    author: string;
    title: string;
    name: string;
    pubDate: string;
    url: string;
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
                    const pageDetails = {
                        url: response.pageDetails.url,
                        title: response.pageDetails.title,
                        author: response.pageDetails.author,
                        pubDate: response.pageDetails.publicationDate.split('T')[0],
                        name: response.pageDetails.websiteName
                    };
    
                    // Set individual state values
                    setUrl(pageDetails.url);
                    setTitle(pageDetails.title);
                    setAuthor(pageDetails.author);
                    setPubDate(pageDetails.pubDate);
                    setName(pageDetails.name);
    
                    // Pass page details to the generateCitation function
                    generateCitation(pageDetails);
                } else {
                    console.error("No response from content script.");
                }
            });

        } catch (error) {
            console.log(error);
        }
    }

    function generateCitation(details: PageDetails) {
        const { author, title, name, pubDate, url } = details;
        const citation = `${author}. "${title}." ${name}, ${pubDate}, ${url}.`;
        setCitation(citation);
    }

    return (
        <div id="citation-page" className="citation-body" >
            <h2>Citation</h2>
            <div>
                <label>URL:</label>
                <input id="cite-input" type="text" value={url} placeholder="URL" />
            </div>
            <div>
                <label>Title:</label>
                <input id="cite-input" type="text" value={title} placeholder="Title" />
            </div>
            <div>
                <label>Author:</label>
                <input id="cite-input" type="text" value={author} placeholder="Author" />
            </div>
            <div>
                <label>Publication Date:</label>
                <input id="cite-input" type="text" value={pubDate} placeholder="Publication Date" />
            </div>
            <div>
                <label>Website Name:</label>
                <input id="cite-input" type="text" value={name} placeholder="Website Name" />
            </div>
            <button id="cite-button" onClick={fillAndCite}>Fill and Cite</button>
            {citation !== '' && (<div id="citation-result">{citation}</div>)}
        </div>
    )
} 